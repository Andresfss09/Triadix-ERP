import { BrainCircuit, TrendingUp, AlertCircle, RefreshCcw } from "lucide-react";

export default function MindModule() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-foreground" /> Motor IA (Mind)
          </h1>
          <p className="text-sm text-muted-foreground">Predicciones, análisis semántico y alertas tempranas de inventario.</p>
        </div>
        <button className="px-4 py-2 bg-foreground text-background rounded font-medium flex items-center gap-2 hover:bg-foreground/90">
          <RefreshCcw className="w-4 h-4" /> Recalcular Vectores
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm col-span-2">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-foreground" /> Predicción de Reabastecimiento
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-accent/50 border border-border rounded flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">Tubería PVC Sanitaria Pavco 3"</p>
                <p className="text-sm text-muted-foreground">Stock actual: 85 unid. | Rotación: Alta (Constructora Alpha)</p>
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Quiebre estimado en 4 días hábiles.</p>
              </div>
              <button className="px-4 py-2 bg-card border border-border text-foreground font-medium rounded hover:bg-accent text-sm">
                Sugerir Orden de Compra (Siderúrgica)
              </button>
            </div>
            <div className="p-4 bg-accent/50 border border-border rounded flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">Vinilo Koraza Pintuco Exterior 5 Gal</p>
                <p className="text-sm text-muted-foreground">Stock actual: 0 unid. | Demanda latente detectada en búsquedías.</p>
                <p className="text-xs text-foreground mt-2 font-medium">Sustituto ofrecido automáticamente: Vinilo Tipo 1 (14 ventas recuperadías)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            Estado de Modelos Vectoriales
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Catálogo Vectorizado</span>
                <span className="font-bold text-green-600">100%</span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Precisión Semántica (Mostrador)</span>
                <span className="font-bold text-foreground">94.2%</span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              El motor está utilizando 384 dimensiones en PostgreSQL (pgvector) para buscar sinónimos de jerga colombiana ferretera (ej. "chazo" = "taco", "puntilla" = "clavo").
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


