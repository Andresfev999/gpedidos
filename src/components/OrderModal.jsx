import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { formatCurrency } from '../utils/format';

function OrderModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        client: '',
        product: '',
        cost: '',
        price: '',
        paid_amount: '',
        status: 'Pendiente por comprar'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                // Ensure paid_amount exists, default to 0 if undefined
                paid_amount: initialData.paid_amount !== undefined ? initialData.paid_amount : 0
            });
        } else {
            setFormData({
                client: '',
                product: '',
                cost: '',
                price: '',
                paid_amount: '', // Empty for new
                status: 'Pendiente por comprar'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            cost: Number(formData.cost),
            price: Number(formData.price),
            paid_amount: Number(formData.paid_amount) || 0
        });
        onClose();
    };

    const cost = Number(formData.cost) || 0;
    const price = Number(formData.price) || 0;
    const paid = Number(formData.paid_amount) || 0;

    const profit = price - cost;
    const balance = price - paid;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>{initialData ? 'Editar Pedido' : 'Nuevo Pedido'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Cliente</label>
                        <input
                            required
                            className="glass-input"
                            value={formData.client}
                            onChange={e => setFormData({ ...formData, client: e.target.value })}
                            placeholder="Nombre del cliente"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Producto</label>
                        <input
                            required
                            className="glass-input"
                            value={formData.product}
                            onChange={e => setFormData({ ...formData, product: e.target.value })}
                            placeholder="Descripción del producto"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Costo</label>
                            <input
                                required
                                type="number"
                                className="glass-input"
                                value={formData.cost}
                                onChange={e => setFormData({ ...formData, cost: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Precio Venta</label>
                            <input
                                required
                                type="number"
                                className="glass-input"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#60a5fa' }}>Abono / Pago Parcial</label>
                        <input
                            type="number"
                            className="glass-input"
                            value={formData.paid_amount}
                            onChange={e => setFormData({ ...formData, paid_amount: e.target.value })}
                            placeholder="0"
                            style={{ borderColor: '#60a5fa' }}
                        />
                        <div className="flex-between" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Saldo Restante:</span>
                            <span style={{ color: balance > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold' }}>
                                {formatCurrency(balance)}
                            </span>
                        </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <div className="flex-between">
                            <span>Ganancia Estimada:</span>
                            <span style={{
                                color: profit >= 0 ? 'var(--success)' : 'var(--danger)',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>
                                {formatCurrency(profit)}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Estado</label>
                        <select
                            className="glass-input"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Pendiente por comprar" style={{ color: 'black' }}>Pendiente por comprar</option>
                            <option value="Por entregar" style={{ color: 'black' }}>Por entregar</option>
                            <option value="Entregado" style={{ color: 'black' }}>Entregado</option>
                            <option value="Pagado" style={{ color: 'black' }}>Pagado</option>
                        </select>
                    </div>

                    <button type="submit" className="glass-button" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                        <Save size={18} />
                        Guardar Pedido
                    </button>
                </form>
            </div>
        </div>
    );
}

export default OrderModal;
