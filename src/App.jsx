import { useState } from 'react';
import { Package, Plus, DollarSign, TrendingUp, Search, Edit, Trash2 } from 'lucide-react';
import { useData } from './context/DataContext';
import { formatCurrency } from './utils/format';
import OrderModal from './components/OrderModal';
import './index.css';

function App() {
  const { orders, addOrder, updateOrder, deleteOrder, stats } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(
    order => order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (orderData) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
    } else {
      addOrder(orderData);
    }
  };

  const openAddModal = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      deleteOrder(id);
    }
  };

  return (
    <>
      <header className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            padding: '0.75rem',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
          }}>
            <Package color="white" size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>GPedidos</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gestor de Emprendimiento</p>
          </div>
        </div>

        <button className="glass-button" onClick={openAddModal}>
          <Plus size={18} />
          Nuevo Pedido
        </button>
      </header>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Ganancia Total"
          value={formatCurrency(stats.totalProfit)}
          icon={<DollarSign size={24} color="#34d399" />}
          trend="Acumulado Histórico"
        />
        <StatCard
          title="Pedidos Activos"
          value={stats.activeOrders}
          icon={<Package size={24} color="#6366f1" />}
          trend={`${stats.totalOrders} pedidos totales`}
        />
        <StatCard
          title="Inversión Pendiente"
          value={formatCurrency(stats.pendingInvestment)}
          icon={<DollarSign size={24} color="#f87171" />}
          trend="Costo por comprar"
        />
        <StatCard
          title="Margen Promedio"
          value={stats.totalProfit > 0 ? ((stats.totalProfit / orders.reduce((acc, o) => acc + o.price, 0)) * 100).toFixed(1) + '%' : '0%'}
          icon={<TrendingUp size={24} color="#ec4899" />}
          trend="Rentabilidad Global"
        />
      </div>

      {/* Main Content */}
      <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '500px' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Pedidos Recientes</h2>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar cliente o producto..."
              className="glass-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Costo</th>
                <th>Precio</th>
                <th>Ganancia</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 500 }}>{order.client}</td>
                    <td>{order.product}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatCurrency(order.cost)}</td>
                    <td>
                      {formatCurrency(order.price)}
                      {order.price - (order.paid_amount || 0) > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>
                          Deben: {formatCurrency(order.price - (order.paid_amount || 0))}
                        </div>
                      )}
                      {(order.paid_amount > 0 && order.price - (order.paid_amount || 0) > 0) && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                          Abonado: {formatCurrency(order.paid_amount)}
                        </div>
                      )}
                    </td>
                    <td style={{ color: '#34d399', fontWeight: 'bold' }}>
                      +{formatCurrency(order.price - order.cost)}
                    </td>
                    <td>
                      <span className={`badge ${order.status === 'Pagado' ? 'badge-success' :
                        order.status === 'Entregado' ? 'badge-info' :
                          order.status === 'Por entregar' ? 'badge-warning' :
                            'badge-danger'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditModal(order)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No hay pedidos que coincidan con tu búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingOrder}
      />
    </>
  );
}

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{title}</span>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '0.5rem',
          borderRadius: '8px'
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{trend}</div>
    </div>
  );
}

export default App;
