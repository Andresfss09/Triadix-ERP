"use client"

import { Shield, Lock, Activity, Users, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function ShieldDashboard() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6 max-w-7xl mx-auto">
      
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card text-foreground p-6 rounded-xl shadow-sm border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Shield className="w-64 h-64 text-foreground" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-foreground" strokeWidth={1.5} /> Triadix Shield
          </h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-xl leading-relaxed">
            Centro de Operaciones de Seguridad (SOC). Supervisión RLS, Auditoría Inmutable y Control de Acceso Zero Trust para todas las sedes en Colombia.
          </p>
        </div>
        <div className="text-right relative z-10 bg-accent/50 p-4 rounded-lg border border-border">
          <p className="text-xs font-mono text-muted-foreground mb-1 tracking-wider uppercase">Shield Score</p>
          <p className="text-5xl font-black text-foreground">
            98<span className="text-2xl text-muted-foreground font-light">/100</span>
          </p>
        </div>
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard variants={fadeUp} title="Políticas RLS Activas" value="14" status="Óptimo" icon={Lock} />
        <MetricCard variants={fadeUp} title="Usuarios con MFA" value="100%" status="Requerido (Admins)" icon={Users} />
        <MetricCard variants={fadeUp} title="Intentos Bloqueados" value="3" status="Últimas 24h" icon={Activity} alert />
      </motion.div>

      <motion.div variants={fadeUp} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-accent/30 flex justify-between items-center">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} /> Registro de Auditoría (Inmutable)
          </h2>
          <span className="flex items-center gap-2 text-xs px-2.5 py-1 bg-background text-foreground rounded-full font-mono font-medium border border-border">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse"></span>
            LIVE SYNC
          </span>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-accent/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Timestamp (UTC)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Acción</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Tabla</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Sede Involucrada</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Detalle de Mutación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-xs bg-background">
              <LogVisualizer action="INSERT" time="Hoy, 15:02:11" table="branches" branch="Bogotá (Paloquemao)" detail='{"name": "Sede Norte..."}' />
              <LogVisualizer action="UPDATE" time="Hoy, 14:45:00" table="profiles" branch="Medellín (La Bayadera)" detail='{"role": "gerente_sede"}' />
              <LogVisualizer action="DELETE" time="Hoy, 10:15:22" table="auth.sessions" branch="Cali (San Nicolás)" detail='Sesión revocada preventivamente' />
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

const MetricCard = motion.create(
  ({ title, value, status, icon: Icon, alert }: any) => {
    return (
      <div className="bg-card p-6 border border-border rounded-xl shadow-sm relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.02] transition-transform group-hover:scale-150 bg-foreground`}></div>
        <div className="flex justify-between items-start mb-4 text-muted-foreground">
          <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
          <div className={`p-2 rounded-lg bg-accent`}>
            <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-4xl font-light mb-3 text-foreground">{value}</div>
        <div className="mt-auto">
          <span className={`text-xs font-mono px-2.5 py-1 rounded-md border text-foreground bg-accent border-border`}>
            {status}
          </span>
        </div>
      </div>
    );
  }
);

function LogVisualizer({ action, time, table, branch, detail }: any) {
  return (
    <tr className="transition-colors hover:bg-accent/50 group">
      <td className="px-6 py-4 text-muted-foreground">{time}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded text-[10px] font-bold border border-border bg-accent text-foreground`}>
          {action}
        </span>
      </td>
      <td className="px-6 py-4 font-medium text-foreground">{table}</td>
      <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-border group-hover:bg-foreground transition-colors"></div>
        {branch}
      </td>
      <td className="px-6 py-4 text-right text-muted-foreground truncate max-w-[200px] hover:text-foreground transition-colors cursor-help" title={detail}>
        {detail}
      </td>
    </tr>
  );
}
