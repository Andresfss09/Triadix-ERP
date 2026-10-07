"use client"

import { Package, TrendingUp, AlertTriangle, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ERPDashboard() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8 max-w-7xl mx-auto">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel Principal</h1>
          <p className="text-muted-foreground mt-1">Resumen de operaciones de Triadix ERP (Sede Principal Norte)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-foreground text-background font-medium px-3 py-1.5 rounded-full shadow-sm">
            MFA Activo
          </span>
        </div>
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Ventas de Hoy" value="$14,592.00" trend="+12.5%" trendUp={true} icon={TrendingUp} />
        <DashboardCard title="Órdenes Pendientes" value="24" trend="-2" trendUp={false} icon={Package} />
        <DashboardCard title="Alertas de Stock" value="18 SKUs" trend="Crítico" trendUp={false} icon={AlertTriangle} alert />
        <DashboardCard title="Traslados en Tránsito" value="3" trend="Hacia esta sede" trendUp={true} icon={ArrowRightLeft} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
            <h2 className="font-semibold text-foreground">Movimientos Recientes</h2>
            <button className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">Ver todos</button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-5 py-4 font-medium">Ref / Factura</th>
                  <th className="px-5 py-4 font-medium">Tipo</th>
                  <th className="px-5 py-4 font-medium">Cliente/Origen</th>
                  <th className="px-5 py-4 font-medium text-right">Total</th>
                  <th className="px-5 py-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <TransactionRow id="FAC-0092" type="Venta POS" client="Consumidor Final" amount="$125.50" status="Completado" />
                <TransactionRow id="TR-0041" type="Traslado IN" client="Sede Sur" amount="-" status="En Tránsito" />
                <TransactionRow id="FAC-0091" type="Venta Cred." client="Constructora Alpha" amount="$3,450.00" status="Aprobado" />
                <TransactionRow id="ORD-0112" type="Orden Compra" client="Aceros del Valle" amount="$12,000.00" status="Pendiente" />
                <TransactionRow id="FAC-0090" type="Venta POS" client="Juan Pérez" amount="$45.00" status="Completado" />
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-foreground">Sugerencias Mind (IA)</h2>
            <p className="text-xs text-muted-foreground mt-1">Análisis de reposición predictiva</p>
          </div>
          <div className="p-5 flex-1 space-y-4">
            <MindAlert product="Lámina Galvanizada 3x3" reason="Alta probabilidad de quiebre de stock por histórico climático." action="Solicitar Traslado" />
            <MindAlert product="Cemento Portland 50kg" reason="Rotación 20% superior a la media. Proveedor: 3 días." action="Generar Orden" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DashboardCard({ title, value, trend, trendUp, icon: Icon, alert }: any) {
  return (
    <motion.div variants={fadeUp} className="bg-card p-6 rounded-xl border border-border shadow-sm group hover:border-foreground/20 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-foreground tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg border ${alert ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-muted text-foreground border-border'}`}>
          <Icon strokeWidth={1.5} className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${alert ? 'text-destructive' : 'text-foreground'}`}>
          {trend}
        </span>
        {trend !== 'Crítico' && trend !== 'Hacia esta sede' && (
          <span className="text-muted-foreground ml-2">vs ayer</span>
        )}
      </div>
    </motion.div>
  );
}

function TransactionRow({ id, type, client, amount, status }: any) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-5 py-4 font-medium text-foreground">{id}</td>
      <td className="px-5 py-4 text-muted-foreground">{type}</td>
      <td className="px-5 py-4 text-muted-foreground">{client}</td>
      <td className="px-5 py-4 text-right font-medium text-foreground">{amount}</td>
      <td className="px-5 py-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border border-border bg-background text-foreground shadow-sm">
          {status}
        </span>
      </td>
    </tr>
  );
}

function MindAlert({ product, reason, action }: any) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg border border-border text-sm hover:border-foreground/30 transition-colors">
      <p className="font-semibold text-foreground mb-1">{product}</p>
      <p className="text-muted-foreground text-xs mb-3 leading-relaxed">{reason}</p>
      <button className="text-xs font-semibold bg-foreground text-background px-4 py-2 rounded-md hover:opacity-90 transition-opacity w-full text-center shadow-sm">
        {action}
      </button>
    </div>
  );
}

