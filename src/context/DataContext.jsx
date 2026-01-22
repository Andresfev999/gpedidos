import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();

        // Real-time subscription
        const channel = supabase
            .channel('orders_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                handleRealtimeUpdate(payload);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRealtimeUpdate = (payload) => {
        if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => order.id === payload.new.id ? payload.new : order));
        } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
        }
    };

    const addOrder = async (order) => {
        // Optimistic update optional, but let's rely on realtime for simplicity or local append
        // Database expects snake_case, assuming mapper handles it or we send matching keys
        const { error } = await supabase.from('orders').insert([{
            client: order.client,
            product: order.product,
            cost: order.cost,
            price: order.price,
            status: order.status,
            paid_amount: order.paid_amount || 0,
            date: order.date || new Date().toISOString().split('T')[0]
        }]);

        if (error) {
            alert('Error al guardar: ' + error.message);
        }
    };

    const updateOrder = async (id, updatedOrder) => {
        const { error } = await supabase.from('orders').update({
            client: updatedOrder.client,
            product: updatedOrder.product,
            cost: updatedOrder.cost,
            price: updatedOrder.price,
            status: updatedOrder.status,
            paid_amount: updatedOrder.paid_amount
        }).eq('id', id);

        if (error) {
            alert('Error al actualizar: ' + error.message);
        }
    };

    const deleteOrder = async (id) => {
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) {
            alert('Error al eliminar: ' + error.message);
        }
    };

    // Derived stats
    const stats = {
        totalProfit: orders.reduce((acc, o) => acc + (Number(o.price) - Number(o.cost)), 0),
        activeOrders: orders.filter(o => o.status === 'Pendiente por comprar' || o.status === 'Por entregar').length,
        pendingInvestment: orders.filter(o => o.status === 'Pendiente por comprar').reduce((acc, o) => acc + Number(o.cost), 0),
        totalOrders: orders.length
    };

    return (
        <DataContext.Provider value={{ orders, addOrder, updateOrder, deleteOrder, stats, loading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
