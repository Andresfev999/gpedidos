import React, { useState } from 'react';
import { formatCurrency } from '../utils/format';
import { Printer, Copy, Check } from 'lucide-react';

function InvoiceModal({ isOpen, onClose, orders }) {
    if (!isOpen) return null;
    const [copied, setCopied] = useState(false);

    const total = orders.reduce((sum, order) => sum + order.price, 0);
    const totalPaid = orders.reduce((sum, order) => {
        if (order.status === 'Pagado') return sum + order.price;
        return sum + (order.paid_amount || 0);
    }, 0);
    const totalDue = total - totalPaid;
    const uniqueClients = [...new Set(orders.map(o => o.client))];
    const displayClient = uniqueClients.length === 1 ? uniqueClients[0] : 'Varios Clientes';

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        let text = `*Comprobante ProtonShop*\n` +
            `Cliente: ${displayClient}\n\n` +
            `*Pedidos:*\n` +
            orders.map(o => `- ${o.product}: ${formatCurrency(o.price)}`).join('\n') +
            `\n\n*Subtotal: ${formatCurrency(total)}*\n`;

        if (totalPaid > 0) {
            text += `Abonado: -${formatCurrency(totalPaid)}\n`;
        }

        text += `*Total a Pagar: ${formatCurrency(totalDue)}*\n\n` +
            `Gracias por su compra.`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="invoice-modal-overlay">
            <div className="glass-panel invoice-modal-content" style={{ maxWidth: '800px' }}>
                <div className="flex-between invoice-header no-print" style={{ marginBottom: '1rem' }}>
                    <h2>Vista Previa de Factura</h2>
                    <button onClick={onClose} className="glass-button" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        X
                    </button>
                </div>

                {/* Printable Area */}
                <div className="printable-area">
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '2px solid #f1f5f9' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '0.5rem', letterSpacing: '-1px' }}>ProtonShop</h1>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Soluciones Digitales</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ fontSize: '1.5rem', color: '#cbd5e1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Factura</h2>
                            <p style={{ color: '#0f172a', fontWeight: '600' }}>#{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Fecha: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600', marginBottom: '0.5rem' }}>Facturar a:</p>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>{displayClient}</h3>
                        {uniqueClients.length === 1 && (
                            <p style={{ color: '#64748b' }}>Cliente Registrado</p>
                        )}
                    </div>

                    {/* Table */}
                    <table style={{ width: '100%', marginBottom: '2rem', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={{ textAlign: 'left', padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', borderRadius: '6px 0 0 6px' }}>Producto / Descripción</th>
                                <th style={{ textAlign: 'right', padding: '1rem', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', borderRadius: '0 6px 6px 0' }}>Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem', color: '#334155' }}>
                                        <div style={{ fontWeight: '500', color: '#0f172a' }}>{order.product}</div>
                                        {uniqueClients.length > 1 && <div style={{ fontSize: '0.8em', color: '#94a3b8', marginTop: '0.25rem' }}>Cliente: {order.client}</div>}
                                    </td>
                                    <td style={{ textAlign: 'right', padding: '1rem', color: '#334155', fontWeight: '500' }}>{formatCurrency(order.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style={{ padding: '2rem 1rem 0', textAlign: 'right', color: '#64748b' }}>Subtotal</td>
                                <td style={{ padding: '2rem 1rem 0', textAlign: 'right', color: '#0f172a', fontWeight: '600' }}>{formatCurrency(total)}</td>
                            </tr>
                            {totalPaid > 0 && (
                                <tr>
                                    <td style={{ padding: '0.5rem 1rem 0', textAlign: 'right', color: '#10b981' }}>Abonado</td>
                                    <td style={{ padding: '0.5rem 1rem 0', textAlign: 'right', color: '#10b981', fontWeight: '600' }}>-{formatCurrency(totalPaid)}</td>
                                </tr>
                            )}
                            <tr>
                                <td style={{ padding: '0.5rem 1rem 1rem', textAlign: 'right', color: '#0f172a', fontWeight: '700', fontSize: '1.2rem', borderTop: 'none' }}>Total a Pagar</td>
                                <td style={{ padding: '0.5rem 1rem 1rem', textAlign: 'right', color: '#6366f1', fontWeight: '700', fontSize: '1.5rem' }}>
                                    {formatCurrency(totalDue)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Footer */}
                    <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ maxWidth: '60%' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>Términos y Condiciones</p>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
                                Gracias por su confianza. El pago debe realizarse antes de la entrega o según lo acordado.
                                Para cualquier consulta sobre esta factura, por favor contáctenos.
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#cbd5e1' }}>ProtonShop</p>
                        </div>
                    </div>
                </div>

                <div className="no-print" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="glass-button">
                        Cancelar
                    </button>
                    <button onClick={handleCopy} className="glass-button" style={{ background: copied ? 'var(--success)' : 'var(--glass-bg)', borderColor: 'var(--success)' }}>
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        <span style={{ marginLeft: '0.5rem' }}>
                            {copied ? '¡Copiado!' : 'Copiar para WhatsApp'}
                        </span>
                    </button>
                    <button onClick={handlePrint} className="glass-button" style={{ background: 'var(--primary)', color: 'white' }}>
                        <Printer size={18} style={{ marginRight: '0.5rem' }} />
                        Imprimir / Guardar PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvoiceModal;
