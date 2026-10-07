"use client"

import { useState } from 'react';
import { Search, ShoppingCart, User, CreditCard, Trash2, CheckCircle2, Download, X } from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from 'framer-motion';

// Mocked real hardware store data (Tubolaminas SAS style)
const inventory = [
  { id: 1, sku: 'TUB-AG-1/2', name: 'Tubo Aguas Negras Pavco 1/2" 6m', price: 18500, stock: 450, category: 'Plomería' },
  { id: 2, sku: 'TUB-PVC-3', name: 'Tubería PVC Sanitaria Pavco 3" 6m', price: 45000, stock: 120, category: 'Plomería' },
  { id: 3, sku: 'LAM-GALV-C26', name: 'Lámina Galvanizada Calibre 26 (1x2m)', price: 48000, stock: 300, category: 'Láminas' },
  { id: 4, sku: 'LAM-COL-R101', name: 'Lámina Teja Color Rojo Arquitectónica 3m', price: 65000, stock: 150, category: 'Láminas' },
  { id: 5, sku: 'PER-STR-2X2', name: 'Perfil Estructural Cuadrado 2x2" 2mm 6m', price: 82000, stock: 85, category: 'Aceros' },
  { id: 6, sku: 'VAR-CORR-1/2', name: 'Varilla Corrugada Sidoc 1/2" (12mm) 6m', price: 19500, stock: 1200, category: 'Aceros' },
  { id: 7, sku: 'CEM-ARGOS-50', name: 'Cemento Gris Argos 50kg', price: 31500, stock: 400, category: 'Obra Gris' },
  { id: 8, sku: 'MALLA-SIMA', name: 'Malla Electrosoldada Sima 4mm (2.35x6m)', price: 95000, stock: 40, category: 'Aceros' },
  { id: 9, sku: 'DISC-CORTE-4', name: 'Disco de Corte Metal Dewalt 4 1/2"', price: 8500, stock: 600, category: 'Ferretería' },
  { id: 10, sku: 'SOLD-6013-1/8', name: 'Soldadura West Arco 6013 1/8 (Kilo)', price: 14500, stock: 200, category: 'Ferretería' },
  { id: 11, sku: 'PINT-ANTICOR', name: 'Anticorrosivo Gris Pintuco 1 Galón', price: 58000, stock: 65, category: 'Pinturas' },
  { id: 12, sku: 'SIKA-1-GAL', name: 'Impermeabilizante Sika 1 Galón', price: 68000, stock: 34, category: 'Obra Gris' },
];

export default function POSModule() {
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  
  const [clientData, setClientData] = useState({
    name: '',
    nit: '',
    address: '',
    phone: '',
    email: ''
  });

  const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);

  const filtered = inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const iva = total * 0.19;
  const grandTotal = total + iva;

  const initiateCheckout = () => {
    setIsClientModalOpen(true);
  };

  const completeCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setLastOrderDetails({
      items: [...cart],
      total,
      iva,
      grandTotal,
      client: { ...clientData },
      date: new Date().toLocaleString('es-CO'),
      invoiceNumber: `FAC-${Math.floor(10000 + Math.random() * 90000)}`
    });
    setIsClientModalOpen(false);
    setCompleted(true);
  };

  const downloadInvoice = () => {
    if (!lastOrderDetails) return;

    const doc = new jsPDF();
    
    // Header (Simulating a DIAN e-invoice format for TRIADIX S.A.S)
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("TRIADIX S.A.S.", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("NIT: 900.123.456-7", 14, 26);
    doc.text("Dirección: Calle Principal #123, Bogotá", 14, 31);
    doc.text("Régimen Común - Responsable de IVA", 14, 36);
    doc.text("Teléfono: (601) 555-4321", 14, 41);
    
    // Invoice Info
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`FACTURA ELECTRÓNICA DE VENTA`, 14, 53);
    
    doc.setFontSize(10);
    doc.text(`No. Documento: ${lastOrderDetails.invoiceNumber}`, 14, 60);
    doc.text(`Fecha y Hora: ${lastOrderDetails.date}`, 14, 65);
    
    // Client Info
    doc.text(`Cliente: ${lastOrderDetails.client.name.toUpperCase()}`, 14, 75);
    doc.text(`CC/NIT: ${lastOrderDetails.client.nit}`, 14, 80);
    doc.text(`Dirección: ${lastOrderDetails.client.address}`, 14, 85);
    doc.text(`Teléfono: ${lastOrderDetails.client.phone}`, 14, 90);
    if (lastOrderDetails.client.email) {
      doc.text(`Correo: ${lastOrderDetails.client.email}`, 14, 95);
    }

    // CUFE Mock
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`CUFE: ${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`, 14, 102);

    // Items Table
    autoTable(doc, {
      startY: 108,
      head: [['SKU', 'Descripción', 'Cant.', 'V. Unit', 'Total']],
      body: lastOrderDetails.items.map((item: any) => [
        item.sku,
        item.name,
        item.qty,
        `$${item.price.toLocaleString('es-CO')}`,
        `$${(item.price * item.qty).toLocaleString('es-CO')}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [13, 148, 136] } // Teal color
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Subtotal: $${lastOrderDetails.total.toLocaleString('es-CO')}`, 140, finalY);
    doc.text(`IVA (19%): $${lastOrderDetails.iva.toLocaleString('es-CO')}`, 140, finalY + 6);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total a Pagar: $${lastOrderDetails.grandTotal.toLocaleString('es-CO')}`, 140, finalY + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Autorización de Numeración de Facturación DIAN", 14, finalY + 30);
    doc.text("Resolución No. 1876201928374 del 2026-01-01", 14, finalY + 35);

    doc.save(`${lastOrderDetails.invoiceNumber}_Triadix.pdf`);
  };

  if (completed) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-card rounded-lg border border-border shadow-sm p-8">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" strokeWidth={1.5} />
        <h2 className="text-3xl font-bold text-foreground">Venta Completada</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-sm">
          La factura {lastOrderDetails?.invoiceNumber} a nombre de {lastOrderDetails?.client.name} ha sido registrada.
        </p>
        
        <div className="flex gap-4 mt-8">
          <button 
            onClick={downloadInvoice}
            className="px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" /> Descargar Factura (PDF)
          </button>
          <button 
            onClick={() => { setCart([]); setCompleted(false); setClientData({ name: '', nit: '', address: '', phone: '', email: '' }); }}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20"
          >
            Nueva Venta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] relative">
      {/* Products Section */}
      <div className="flex-1 flex flex-col bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar por código de barras, nombre o SKU..." 
              className="w-full pl-10 pr-4 py-2 bg-accent/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-accent text-foreground font-medium rounded-lg hover:bg-accent/80 border border-border transition-colors">
            Escáner
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="border border-border rounded-lg p-4 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all flex flex-col bg-background/50"
            >
              <div className="text-xs font-mono text-muted-foreground mb-1">{product.sku}</div>
              <div className="font-semibold text-foreground leading-tight flex-1">{product.name}</div>
              <div className="mt-4 flex justify-between items-end">
                <div className="text-sm font-bold text-foreground">${product.price.toLocaleString('es-CO')}</div>
                <div className="text-xs text-muted-foreground">Stock: {product.stock}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 flex flex-col bg-accent/30 border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-card flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2 text-foreground"><ShoppingCart className="w-5 h-5" /> Orden Actual</h2>
          <button onClick={() => setIsClientModalOpen(true)} className="text-xs flex items-center gap-1 text-teal-600 hover:underline font-medium">
            <User className="w-4 h-4" /> Asignar Cliente
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Seleccione productos para vender
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-card p-3 border border-border rounded-lg shadow-sm flex justify-between items-center group">
                <div className="flex-1 overflow-hidden pr-2">
                  <p className="text-sm font-medium leading-tight truncate text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">${item.price.toLocaleString('es-CO')} x {item.qty}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-foreground">${(item.price * item.qty).toLocaleString('es-CO')}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-500 p-1.5 rounded-md hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-card border-t border-border p-5">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Subtotal</span>
            <span>${total.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mb-3">
            <span>IVA (19%)</span>
            <span>${iva.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between font-bold text-xl text-foreground border-t border-border pt-3 mb-5">
            <span>Total</span>
            <span>${grandTotal.toLocaleString('es-CO')}</span>
          </div>
          
          <button 
            disabled={cart.length === 0}
            onClick={initiateCheckout}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
          >
            <CreditCard className="w-5 h-5" /> Facturar y Pagar
          </button>
        </div>
      </div>

      {/* Client Data Modal */}
      <AnimatePresence>
        {isClientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsClientModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-accent/30">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Datos del Cliente (Facturación)
                </h3>
                <button onClick={() => setIsClientModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-background rounded-md p-1 border border-border">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={completeCheckout} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Nombre / Razón Social</label>
                  <input 
                    type="text" 
                    value={clientData.name}
                    onChange={e => setClientData({...clientData, name: e.target.value})}
                    placeholder="Ej. Juan Pérez / Constructora XYZ"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">NIT / C.C.</label>
                    <input 
                      type="text" 
                      value={clientData.nit}
                      onChange={e => setClientData({...clientData, nit: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Teléfono de Contacto</label>
                    <input 
                      type="tel" 
                      value={clientData.phone}
                      onChange={e => setClientData({...clientData, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                  <input 
                    type="text" 
                    value={clientData.address}
                    onChange={e => setClientData({...clientData, address: e.target.value})}
                    placeholder="Ej. Calle 123 #45-67"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Correo Electrónico (Opcional)</label>
                  <input 
                    type="email" 
                    value={clientData.email}
                    onChange={e => setClientData({...clientData, email: e.target.value})}
                    placeholder="facturacion@empresa.com"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                  <button type="button" onClick={() => setIsClientModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border hover:bg-accent rounded-lg transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Finalizar Venta
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
