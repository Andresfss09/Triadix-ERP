"use client"

import { useState, useEffect } from 'react';
import { Search, MapPin, Package, AlertTriangle, ArrowRightLeft, Sparkles, X } from 'lucide-react';

export function SmartCounter() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Handle Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  const isSearchingLaminas = query.toLowerCase().includes('lamina') || query.toLowerCase().includes('lámina');

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            className="flex-1 text-lg outline-none text-slate-800 placeholder-slate-400 bg-transparent"
            placeholder="Mostrador Inteligente (Ej: 'lámina 3x3', 'cemento gris')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setOpen(false)} className="p-1 rounded-md text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 bg-slate-50">
          {!query && (
            <div className="text-center py-10 text-slate-500">
              <Sparkles className="w-10 h-10 mx-auto text-blue-200 mb-3" />
              <p className="text-sm">El motor de IA (Mind) buscará por exactitud, sinónimos y contexto.</p>
            </div>
          )}

          {isSearchingLaminas && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Resultados Exactos & Semánticos</h3>
                
                {/* Result 1 - Sold out but substitute available */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">Lámina de Acero HR 3x3mm (1x2m)</h4>
                      <p className="text-xs text-slate-500 font-mono">SKU: LAM-HR-3X3-1X2</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-slate-800">$45,200</p>
                    </div>
                  </div>
                  
                  {/* Availability Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-red-50 border border-red-100 p-2 rounded flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-sm text-red-800 font-medium">
                        <MapPin className="w-4 h-4" /> Sede Principal (Actual)
                      </div>
                      <span className="text-xs font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded">AGOTADO</span>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-2 rounded flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-sm text-green-800 font-medium">
                        <MapPin className="w-4 h-4" /> Sede Norte (a 4.2 km)
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-700">Stock: 42</span>
                        <button className="text-xs bg-white border border-green-200 text-green-700 px-2 py-1 rounded shadow-sm hover:bg-green-100 font-medium">
                          Trasladar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mind Suggestion */}
                  <div className="mt-3 bg-purple-50 border border-purple-100 rounded p-3 flex gap-3 items-start">
                    <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-purple-900">Mind sugiere un sustituto inmediato en esta sede:</p>
                      <div className="flex justify-between items-center mt-2 bg-white p-2 rounded border border-purple-100 shadow-sm">
                        <div>
                          <p className="text-sm font-medium text-slate-800">Lámina Galvanizada 3x3mm (1x2m)</p>
                          <p className="text-xs text-slate-500">Mismas medidas, mayor resistencia a corrosión.</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold">$48,500</span>
                          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">Hay 15 unid.</span>
                          <button className="text-xs bg-purple-600 text-white px-2 py-1 rounded shadow hover:bg-purple-700 font-medium">
                            Añadir a POS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer Keyboard Hints */}
        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-t border-slate-200 text-xs text-slate-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-white border px-1 rounded">↓↑</kbd> Navegar</span>
            <span className="flex items-center gap-1"><kbd className="bg-white border px-1 rounded">Enter</kbd> Seleccionar</span>
            <span className="flex items-center gap-1"><kbd className="bg-white border px-1 rounded">Alt+T</kbd> Traslado rápido</span>
          </div>
          <span>Triadix ERP Mostrador Inteligente v1.0</span>
        </div>
      </div>
    </div>
  );
}

