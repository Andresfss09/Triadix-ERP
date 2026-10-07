import { Users, Search, Plus, MoreVertical, Building2, MapPin, User } from "lucide-react";

const clients = [
  { id: 1, name: 'Constructora Alpha SAS', nit: '900.123.456-7', type: 'Empresa', contact: 'María Fernanda Ruiz', phone: '310 456 7890', city: 'Bogotááá', debt: '$4,500,000' },
  { id: 2, name: 'Inversiones El Trébol', nit: '800.987.654-1', type: 'Empresa', contact: 'Carlos Gómez', phone: '315 123 4567', city: 'Medellín', debt: '$0' },
  { id: 3, name: 'Juan Sebastián Osorio', nit: '1.010.234.567', type: 'Persona', contact: 'Mismo', phone: '300 987 6543', city: 'Cali', debt: '$125,000' },
  { id: 4, name: 'Arquitectos del Valle', nit: '901.345.678-9', type: 'Empresa', contact: 'Andrea Villegas', phone: '318 234 5678', city: 'Cali', debt: '$12,300,000' },
];

export default function CRMModule() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-foreground" /> Directorio de Clientes (CRM)
          </h1>
          <p className="text-sm text-muted-foreground">Gestión de contratistas, empresas y clientes mostrador.</p>
        </div>
        <button className="px-4 py-2 bg-foreground text-background rounded font-medium flex items-center gap-2 hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar por Razón Social o NIT/CC..." 
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-accent/50 border border-border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="text-sm border border-border bg-accent/50 rounded px-3 py-1.5 outline-none">
            <option>Todos los tipos</option>
            <option>Empresas (NIT)</option>
            <option>Personas (CC)</option>
          </select>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-accent/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 font-medium">Cliente / Razón Social</th>
              <th className="px-6 py-3 font-medium">NIT / CC</th>
              <th className="px-6 py-3 font-medium">Contacto</th>
              <th className="px-6 py-3 font-medium">Ubicación</th>
              <th className="px-6 py-3 font-medium text-right">Cartera (Deuda)</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map(c => (
              <tr key={c.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${c.type === 'Empresa' ? 'bg-blue-50 text-foreground' : 'bg-green-50 text-green-600'}`}>
                      {c.type === 'Empresa' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-muted-foreground">{c.nit}</td>
                <td className="px-6 py-4">
                  <p className="text-foreground">{c.contact}</p>
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" /> {c.city}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-medium ${c.debt === '$0' ? 'text-green-600' : 'text-red-600'}`}>
                    {c.debt}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-muted-foreground hover:text-muted-foreground"><MoreVertical className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

