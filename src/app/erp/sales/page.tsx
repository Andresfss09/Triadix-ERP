"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Receipt, Plus, Clock, Download, FileText, Trash2, Edit, X, TrendingUp, CalendarDays } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type SaleDocument = {
  id: string;
  doc: string;
  type: string; // 'Factura' | 'Cotización'
  pos: string;
  client: string;
  nit: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  total: number;
  status: string;
};

// Generar historial de ejemplo en varios meses
const generateMocks = (): SaleDocument[] => {
  return [
    { id: '1', doc: 'FAC-0091', type: 'Factura', pos: 'POS-1A', client: 'Consumidor Final', nit: '222222222', date: '2026-10-07', time: '14:31', total: 125500, status: 'PAGADA' },
    { id: '2', doc: 'FAC-0092', type: 'Factura', pos: 'POS-2A', client: 'Constructora XYZ', nit: '901234567', date: '2026-10-06', time: '09:12', total: 251000, status: 'PAGADA' },
    { id: '3', doc: 'COT-0012', type: 'Cotización', pos: 'POS-3A', client: 'Ingeniería Global', nit: '900123456', date: '2026-10-02', time: '16:45', total: 4500000, status: 'PENDIENTE' },
    { id: '4', doc: 'FAC-0089', type: 'Factura', pos: 'POS-1A', client: 'Consumidor Final', nit: '222222222', date: '2026-09-28', time: '11:20', total: 85000, status: 'PAGADA' },
    { id: '5', doc: 'FAC-0088', type: 'Factura', pos: 'POS-2A', client: 'Ferretería El Maestro', nit: '800987654', date: '2026-09-15', time: '10:05', total: 1200500, status: 'PAGADA' },
    { id: '6', doc: 'COT-0011', type: 'Cotización', pos: 'POS-1A', client: 'Constructora XYZ', nit: '901234567', date: '2026-09-02', time: '08:30', total: 3200000, status: 'ANULADA' },
    { id: '7', doc: 'FAC-0080', type: 'Factura', pos: 'POS-3A', client: 'Consumidor Final', nit: '222222222', date: '2026-08-20', time: '15:10', total: 45000, status: 'PAGADA' },
  ];
};

export default function SalesModule() {
  const [items, setItems] = useState<SaleDocument[]>(generateMocks());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2026-10"); // Formato YYYY-MM
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SaleDocument | null>(null);

  const [formData, setFormData] = useState({
    doc: '',
    type: 'Cotización',
    client: '',
    nit: '',
    total: '',
    status: 'PENDIENTE',
    date: ''
  });

  // Filtrar por mes seleccionado y luego por búsqueda
  const filteredItems = items.filter(item => {
    const itemMonth = item.date.substring(0, 7); // Extrae "YYYY-MM"
    const matchesMonth = selectedMonth === "ALL" || itemMonth === selectedMonth;
    const matchesSearch = item.doc.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  // Calcular estadísticas del mes actual
  const monthStats = filteredItems.reduce((acc, item) => {
    if (item.type === 'Factura' && item.status === 'PAGADA') {
      acc.revenue += item.total;
    }
    acc.count += 1;
    return acc;
  }, { revenue: 0, count: 0 });

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({
      doc: `COT-00${items.length + 10}`,
      type: 'Cotización',
      client: '',
      nit: '',
      total: '',
      status: 'PENDIENTE',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: SaleDocument) => {
    setEditingItem(item);
    setFormData({
      doc: item.doc,
      type: item.type,
      client: item.client,
      nit: item.nit,
      total: item.total.toString(),
      status: item.status,
      date: item.date
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este documento?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? {
        ...item,
        doc: formData.doc,
        type: formData.type,
        client: formData.client,
        nit: formData.nit,
        date: formData.date,
        total: parseFloat(formData.total),
        status: formData.status
      } : item));
    } else {
      setItems([{
        id: Date.now().toString(),
        doc: formData.doc,
        type: formData.type,
        pos: 'POS-NUEVO',
        client: formData.client,
        nit: formData.nit,
        date: formData.date,
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        total: parseFloat(formData.total),
        status: formData.status
      }, ...items]);
    }
    setIsModalOpen(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const periodName = selectedMonth === "ALL" ? "Todos los Tiempos" : selectedMonth;
    doc.text(`Reporte de Ventas - Período: ${periodName}`, 14, 15);
    
    autoTable(doc, {
      head: [['Documento', 'Tipo', 'Cliente', 'NIT', 'Fecha', 'Total', 'Estado']],
      body: filteredItems.map(item => [
        item.doc, 
        item.type, 
        item.client, 
        item.nit, 
        item.date, 
        `$${item.total.toLocaleString('es-CO')}`, 
        item.status
      ]),
      startY: 25,
    });

    doc.save(`Reporte_Ventas_${periodName}.pdf`);
  };

  const exportExcel = () => {
    const periodName = selectedMonth === "ALL" ? "Todos_Los_Tiempos" : selectedMonth;
    const worksheet = XLSX.utils.json_to_sheet(filteredItems.map(item => ({
      Documento: item.doc,
      Tipo: item.type,
      POS: item.pos,
      Cliente: item.client,
      NIT: item.nit,
      Fecha: item.date,
      Total: item.total,
      Estado: item.status
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
    XLSX.writeFile(workbook, `Reporte_Ventas_${periodName}.xlsx`);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="space-y-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-teal-600 dark:text-teal-400" /> Historial de Ventas
          </h1>
          <p className="text-sm text-muted-foreground">Controla las estadísticas y facturación por rango de fechas.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={exportPDF} className="px-3 py-2 bg-card hover:bg-accent text-foreground flex items-center gap-2 text-sm font-medium transition-colors border-r border-border" title="Descargar PDF">
              <FileText className="w-4 h-4 text-red-500" /> PDF
            </button>
            <button onClick={exportExcel} className="px-3 py-2 bg-card hover:bg-accent text-foreground flex items-center gap-2 text-sm font-medium transition-colors" title="Descargar Excel">
              <Download className="w-4 h-4 text-emerald-500" /> Excel
            </button>
          </div>
          <button onClick={openNewModal} className="px-4 py-2 bg-teal-600 text-white rounded font-medium flex items-center gap-2 hover:bg-teal-700 shadow-sm shadow-teal-500/20">
            <Plus className="w-4 h-4" /> Nueva Cotización
          </button>
        </div>
      </div>

      {/* Estadísticas del Período Seleccionado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center dark:bg-teal-500/10 dark:text-teal-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ingresos del Período</p>
            <h3 className="text-2xl font-bold text-foreground">${monthStats.revenue.toLocaleString('es-CO')}</h3>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-500/10 dark:text-blue-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Documentos Emitidos</p>
            <h3 className="text-2xl font-bold text-foreground">{monthStats.count}</h3>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 bg-accent/30">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Buscar factura o cliente..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm px-4 py-2 text-sm border border-border bg-background text-foreground rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-muted-foreground hidden sm:block" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-border bg-background font-medium rounded-lg px-4 py-2 text-sm text-foreground outline-none hover:border-border cursor-pointer transition-colors"
            >
              <option value="ALL">Histórico Completo</option>
              <option value="2026-10">Octubre 2026 (Actual)</option>
              <option value="2026-09">Septiembre 2026</option>
              <option value="2026-08">Agosto 2026</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-accent/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Documento</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  key={item.id} 
                  className="hover:bg-accent/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.type === 'Cotización' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400'}`}>
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.doc}</p>
                        <p className="text-xs text-muted-foreground font-mono">{item.type} • {item.pos}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground font-medium">{item.client}</p>
                    <p className="text-xs text-muted-foreground">{item.nit}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-3.5 h-3.5" /> {item.date} {item.time}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-foreground">
                    ${item.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold shadow-sm border ${
                      item.status === 'PAGADA' 
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400' 
                        : item.status === 'PENDIENTE'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:border-yellow-500/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(item)} className="p-1.5 text-muted-foreground hover:text-foreground bg-background border border-border rounded-md hover:bg-accent transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:text-red-600 bg-background border border-border rounded-md hover:bg-red-500/10 transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No se encontraron documentos para este período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-accent/30">
                <h3 className="font-bold text-lg text-foreground">
                  {editingItem ? 'Editar Documento' : 'Nueva Cotización'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-background rounded-md p-1 border border-border">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Nº Documento</label>
                    <input 
                      type="text" 
                      value={formData.doc}
                      onChange={e => setFormData({...formData, doc: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    >
                      <option>Cotización</option>
                      <option>Factura</option>
                      <option>Nota Crédito</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                    <input 
                      type="text" 
                      value={formData.client}
                      onChange={e => setFormData({...formData, client: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">NIT / CC</label>
                    <input 
                      type="text" 
                      value={formData.nit}
                      onChange={e => setFormData({...formData, nit: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Total ($)</label>
                    <input 
                      type="number" 
                      value={formData.total}
                      onChange={e => setFormData({...formData, total: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Estado</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    >
                      <option>PENDIENTE</option>
                      <option>PAGADA</option>
                      <option>ANULADA</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Fecha Emisión</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                    required 
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border hover:bg-accent rounded-lg transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm">
                    {editingItem ? 'Guardar Cambios' : 'Crear Documento'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
