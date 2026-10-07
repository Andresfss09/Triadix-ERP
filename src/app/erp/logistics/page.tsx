import { Truck, Search, ArrowRightLeft, PackagePlus, MapPin } from "lucide-react";

export default function LogisticsModule() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-600" /> Logística y Traslados
          </h1>
          <p className="text-sm text-muted-foreground">Manejo de compras a proveedores y traslados entre sedes.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-card border border-border text-foreground rounded font-medium flex items-center gap-2 hover:bg-accent/50">
            <PackagePlus className="w-4 h-4" /> Orden de Compra
          </button>
          <button className="px-4 py-2 bg-amber-600 text-white rounded font-medium flex items-center gap-2 hover:bg-amber-700">
            <ArrowRightLeft className="w-4 h-4" /> Nuevo Traslado
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traslados en Curso */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 border-b border-border flex justify-between items-center bg-accent/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2">Traslados en Curso</h2>
          </div>
          <div className="p-0">
            <div className="p-4 border-b border-border flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div>
                <p className="font-bold text-foreground">TR-0041: 50x Cemento Argos</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" /> De: Sede Sur <ArrowRightLeft className="w-3 h-3 mx-1" /> A: Principal Norte
                </div>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">En Tránsito (Llega hoy)</span>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div>
                <p className="font-bold text-foreground">TR-0042: 120x Varilla Corrugada</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" /> De: Principal Norte <ArrowRightLeft className="w-3 h-3 mx-1" /> A: Sede Medellín
                </div>
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">Preparando Empaque</span>
            </div>
          </div>
        </div>

        {/* Órdenes de Proveedores */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 border-b border-border flex justify-between items-center bg-accent/50">
            <h2 className="font-semibold text-foreground">Compras a Proveedores</h2>
          </div>
          <div className="p-0">
            <div className="p-4 border-b border-border hover:bg-accent/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-foreground">Siderúrgica de Occidente (SIDOC)</p>
                <span className="text-muted-foreground text-sm">$12,000,000</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">ORD-0112: 500x Varilla Corrugada 1/2"</p>
              <div className="w-full bg-accent rounded-full h-1.5 mb-1">
                <div className="bg-foreground text-background h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground text-right">Producción (Entrega: 15 Oct)</p>
            </div>
            
            <div className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-foreground">Cementos Argos S.A.</p>
                <span className="text-muted-foreground text-sm">$4,500,000</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">ORD-0113: 200x Cemento Gris 50kg</p>
              <div className="w-full bg-accent rounded-full h-1.5 mb-1">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-green-600 font-medium text-right">Listo para Recoger en Planta Yumbo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


