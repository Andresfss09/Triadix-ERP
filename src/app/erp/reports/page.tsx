"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Calendar, DownloadCloud, FileText, User, Eye, Download, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type SaleItem = { sku: string; name: string; qty: number; price: number; };

type SaleDocument = {
  id: string;
  doc: string;
  type: string;
  client: string;
  nit: string;
  address: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  total: number;
  status: string;
  items: SaleItem[];
};

// Generar historial de ejemplo con items detallados
const generateMocks = (): SaleDocument[] => {
  return [
    { 
      id: '1', doc: 'FAC-0091', type: 'Factura', client: 'Consumidor Final', nit: '222222222', address: 'Calle 123 #45-67', date: '2026-10-07', time: '14:31', total: 125500, status: 'PAGADA',
      items: [
        { sku: 'CEM-ARGOS-50', name: 'Cemento Gris Argos 50kg', qty: 2, price: 31500 },
        { sku: 'TUB-PVC-3', name: 'Tubería PVC Sanitaria Pavco 3" 6m', qty: 1, price: 45000 }
      ]
    },
    { 
      id: '2', doc: 'FAC-0092', type: 'Factura', client: 'Constructora XYZ', nit: '901234567', address: 'Av. Industrial #8-90', date: '2026-10-06', time: '09:12', total: 251000, status: 'PAGADA',
      items: [
        { sku: 'VAR-CORR-1/2', name: 'Varilla Corrugada Sidoc 1/2" (12mm) 6m', qty: 10, price: 19500 },
        { sku: 'DISC-CORTE-4', name: 'Disco de Corte Metal Dewalt 4 1/2"', qty: 5, price: 8500 }
      ]
    },
    { 
      id: '3', doc: 'FAC-0093', type: 'Factura', client: 'Constructora XYZ', nit: '901234567', address: 'Av. Industrial #8-90', date: '2026-10-15', time: '11:45', total: 850000, status: 'PAGADA',
      items: [
        { sku: 'LAM-GALV-C26', name: 'Lámina Galvanizada Calibre 26 (1x2m)', qty: 10, price: 48000 },
        { sku: 'LAM-COL-R101', name: 'Lámina Teja Color Rojo Arquitectónica 3m', qty: 5, price: 65000 }
      ]
    },
    { 
      id: '5', doc: 'FAC-0089', type: 'Factura', client: 'Consumidor Final', nit: '222222222', address: 'Calle 123 #45-67', date: '2026-09-28', time: '11:20', total: 85000, status: 'PAGADA',
      items: [
        { sku: 'PER-STR-2X2', name: 'Perfil Estructural Cuadrado 2x2" 2mm 6m', qty: 1, price: 82000 }
      ]
    },
    { 
      id: '6', doc: 'FAC-0088', type: 'Factura', client: 'Ferretería El Maestro', nit: '800987654', address: 'Cra 50 #20-10', date: '2026-09-15', time: '10:05', total: 1200500, status: 'PAGADA',
      items: [
        { sku: 'MALLA-SIMA', name: 'Malla Electrosoldada Sima 4mm', qty: 10, price: 95000 },
        { sku: 'PINT-ANTICOR', name: 'Anticorrosivo Gris Pintuco 1 Galón', qty: 3, price: 58000 }
      ]
    }
  ];
};

export default function ReportsModule() {
  const [items] = useState<SaleDocument[]>(generateMocks());
  const [selectedMonth, setSelectedMonth] = useState("2026-10");
  const [viewingInvoice, setViewingInvoice] = useState<SaleDocument | null>(null);

  const filteredItems = items.filter(item => {
    const itemMonth = item.date.substring(0, 7);
    const matchesMonth = selectedMonth === "ALL" || itemMonth === selectedMonth;
    return matchesMonth && item.type === 'Factura';
  });

  const groupedByClient = filteredItems.reduce((acc, item) => {
    if (!acc[item.client]) {
      acc[item.client] = { nit: item.nit, address: item.address, invoices: [], totalRevenue: 0 };
    }
    acc[item.client].invoices.push(item);
    acc[item.client].totalRevenue += item.total;
    return acc;
  }, {} as Record<string, { nit: string; address: string; invoices: SaleDocument[]; totalRevenue: number }>);

  Object.keys(groupedByClient).forEach(clientName => {
    groupedByClient[clientName].invoices.sort((a, b) => {
      return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
    });
  });

  const downloadSingleInvoice = (inv: SaleDocument) => {
    const doc = new jsPDF();
    const subtotal = inv.items.reduce((acc, it) => acc + (it.price * it.qty), 0);
    const iva = subtotal * 0.19; // Simulación de IVA
    const grandTotal = subtotal + iva; // En este mock el 'total' de la factura es estático, recalculemos para el PDF

    // Membrete TRIADIX
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("TRIADIX S.A.S.", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("NIT: 900.123.456-7", 14, 26);
    doc.text("Dirección: Calle Principal #123, Bogotá", 14, 31);
    doc.text("Régimen Común - Responsable de IVA", 14, 36);
    
    // Info Factura
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`FACTURA ELECTRÓNICA DE VENTA`, 14, 48);
    doc.setFontSize(10);
    doc.text(`No. Documento: ${inv.doc}`, 14, 55);
    doc.text(`Fecha y Hora: ${inv.date} ${inv.time}`, 14, 60);
    doc.text(`Cliente: ${inv.client.toUpperCase()}`, 14, 70);
    doc.text(`CC/NIT: ${inv.nit}`, 14, 75);
    doc.text(`Dirección: ${inv.address}`, 14, 80);

    // Tabla de Items
    autoTable(doc, {
      startY: 90,
      head: [['SKU', 'Descripción', 'Cant.', 'V. Unit', 'Total']],
      body: inv.items.map(it => [
        it.sku, it.name, it.qty, 
        `$${it.price.toLocaleString('es-CO')}`, 
        `$${(it.price * it.qty).toLocaleString('es-CO')}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [13, 148, 136] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Subtotal: $${subtotal.toLocaleString('es-CO')}`, 140, finalY);
    doc.text(`IVA (19%): $${iva.toLocaleString('es-CO')}`, 140, finalY + 6);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total a Pagar: $${grandTotal.toLocaleString('es-CO')}`, 140, finalY + 14);

    doc.save(`${inv.doc}_Triadix.pdf`);
  };

  const exportGeneralPDF = () => {
    const doc = new jsPDF();
    const periodName = selectedMonth === "ALL" ? "Todos los Tiempos" : selectedMonth;
    doc.text(`Reporte de Facturación por Cliente - ${periodName}`, 14, 15);
    
    let yPos = 25;
    Object.entries(groupedByClient).forEach(([clientName, data], index) => {
      if (index > 0) {
        yPos += 15;
        if (yPos > 250) { doc.addPage(); yPos = 20; }
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Cliente: ${clientName} (NIT: ${data.nit})`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total Comprado: $${data.totalRevenue.toLocaleString('es-CO')}`, 140, yPos);
      yPos += 5;

      autoTable(doc, {
        head: [['Fecha y Hora', 'Factura', 'Estado', 'Total']],
        body: data.invoices.map(inv => [
          `${inv.date} ${inv.time}`, inv.doc, inv.status, `$${inv.total.toLocaleString('es-CO')}`
        ]),
        startY: yPos,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        margin: { left: 14 }
      });
      yPos = (doc as any).lastAutoTable.finalY;
    });

    doc.save(`Reporte_Clientes_${periodName}.pdf`);
  };

  const exportExcel = () => {
    const periodName = selectedMonth === "ALL" ? "Todos_Los_Tiempos" : selectedMonth;
    const rows: any[] = [];
    Object.entries(groupedByClient).forEach(([clientName, data]) => {
      data.invoices.forEach(inv => {
        rows.push({
          Cliente: clientName,
          NIT: data.nit,
          Fecha: inv.date,
          Hora: inv.time,
          Factura: inv.doc,
          Estado: inv.status,
          Total: inv.total
        });
      });
    });
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturación Clientes");
    XLSX.writeFile(workbook, `Reporte_Clientes_${periodName}.xlsx`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Reporte de Facturación
          </h1>
          <p className="text-sm text-muted-foreground">Consolidado de compras por cliente, ordenado por pedidos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 shadow-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-medium text-sm text-foreground outline-none cursor-pointer"
            >
              <option value="ALL">Histórico Completo</option>
              <option value="2026-10">Octubre 2026</option>
              <option value="2026-09">Septiembre 2026</option>
              <option value="2026-08">Agosto 2026</option>
            </select>
          </div>
          
          <div className="flex border border-border rounded-lg overflow-hidden shadow-sm">
            <button onClick={exportGeneralPDF} className="px-3 py-2 bg-card hover:bg-accent text-foreground flex items-center gap-2 text-sm font-medium transition-colors border-r border-border">
              <FileText className="w-4 h-4 text-red-500" /> PDF General
            </button>
            <button onClick={exportExcel} className="px-3 py-2 bg-card hover:bg-accent text-foreground flex items-center gap-2 text-sm font-medium transition-colors">
              <DownloadCloud className="w-4 h-4 text-emerald-500" /> Excel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-accent/30">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 
            Desglose por Cliente ({selectedMonth === "ALL" ? "Todos los tiempos" : selectedMonth})
          </h2>
        </div>
        
        <div className="divide-y divide-border">
          {Object.keys(groupedByClient).length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No hay facturas registradas para este mes.
            </div>
          ) : (
            Object.entries(groupedByClient).map(([clientName, data]) => (
              <div key={clientName} className="p-5 hover:bg-accent/10 transition-colors">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{clientName}</h3>
                    <p className="text-sm text-muted-foreground font-mono">NIT: {data.nit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Comprado (Mes)</p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      ${data.totalRevenue.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border border-border rounded-lg overflow-hidden">
                    <thead className="bg-accent/50 text-muted-foreground text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Fecha y Hora</th>
                        <th className="px-4 py-3 font-semibold">Documento</th>
                        <th className="px-4 py-3 font-semibold text-center">Estado</th>
                        <th className="px-4 py-3 font-semibold text-right">Monto</th>
                        <th className="px-4 py-3 font-semibold text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-accent/30 transition-colors group">
                          <td className="px-4 py-3 text-muted-foreground">
                            {inv.date} a las {inv.time}
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">{inv.doc}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-green-200 bg-green-100 text-green-700 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400">
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            ${inv.total.toLocaleString('es-CO')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setViewingInvoice(inv)} className="p-1.5 text-indigo-500 hover:text-indigo-600 bg-background border border-border rounded-md hover:bg-indigo-500/10 transition-colors" title="Ver Detalle">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => downloadSingleInvoice(inv)} className="p-1.5 text-emerald-500 hover:text-emerald-600 bg-background border border-border rounded-md hover:bg-emerald-500/10 transition-colors" title="Descargar Factura">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Detalles Factura */}
      <AnimatePresence>
        {viewingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setViewingInvoice(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-accent/30">
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    Detalle de Documento: {viewingInvoice.doc}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{viewingInvoice.date} a las {viewingInvoice.time}</p>
                </div>
                <button onClick={() => setViewingInvoice(null)} className="text-muted-foreground hover:text-foreground bg-background rounded-md p-1 border border-border">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="p-3 bg-accent/50 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                    <p className="font-semibold text-foreground">{viewingInvoice.client}</p>
                    <p className="text-muted-foreground">NIT: {viewingInvoice.nit}</p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Estado</p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-green-200 bg-green-100 text-green-700 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400">
                      {viewingInvoice.status}
                    </span>
                  </div>
                </div>

                <div className="overflow-hidden border border-border rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-accent/50 text-xs text-muted-foreground uppercase border-b border-border">
                      <tr>
                        <th className="px-4 py-2 font-semibold">SKU</th>
                        <th className="px-4 py-2 font-semibold">Producto</th>
                        <th className="px-4 py-2 font-semibold text-center">Cant.</th>
                        <th className="px-4 py-2 font-semibold text-right">V. Unit</th>
                        <th className="px-4 py-2 font-semibold text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {viewingInvoice.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-muted-foreground font-mono text-xs">{it.sku}</td>
                          <td className="px-4 py-2 font-medium text-foreground">{it.name}</td>
                          <td className="px-4 py-2 text-center">{it.qty}</td>
                          <td className="px-4 py-2 text-right text-muted-foreground">${it.price.toLocaleString('es-CO')}</td>
                          <td className="px-4 py-2 text-right font-medium text-foreground">${(it.qty * it.price).toLocaleString('es-CO')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-right">
                  <p className="text-2xl font-bold text-foreground">Total: ${viewingInvoice.total.toLocaleString('es-CO')}</p>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-accent/30 flex justify-end gap-3">
                <button onClick={() => setViewingInvoice(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border hover:bg-accent rounded-lg transition-colors">
                  Cerrar
                </button>
                <button onClick={() => downloadSingleInvoice(viewingInvoice)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                  <Download className="w-4 h-4" /> Descargar Factura (PDF)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
