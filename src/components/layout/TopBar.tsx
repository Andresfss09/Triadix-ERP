"use client"

import { Search, Bell, Menu, Moon, Sun, ArrowRight, Package, Users, ShoppingCart } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function TopBar() {
  const [mounted, setMounted] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = [
    { type: 'Módulo', title: 'Mostrador (POS)', icon: ShoppingCart, href: '/erp/pos' },
    { type: 'Módulo', title: 'Inventario', icon: Package, href: '/erp/inventory' },
    { type: 'Módulo', title: 'CRM Clientes', icon: Users, href: '/erp/crm' },
    { type: 'Acción', title: 'Crear nueva Cotización', icon: ArrowRight, href: '/erp/sales' },
    { type: 'Producto', title: 'Cemento Gris Argos 50kg', icon: Package, href: '/erp/inventory' },
    { type: 'Cliente', title: 'Constructora S.A.', icon: Users, href: '/erp/crm' }
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
      <div className="flex items-center flex-1 gap-4">
        <button className="p-2 -ml-2 text-muted-foreground hover:text-foreground md:hidden">
          <Menu strokeWidth={1.5} className="w-5 h-5" />
        </button>
        
        {/* Mostrador Inteligente Shortcut */}
        <div className="max-w-md w-full relative group hidden sm:block" ref={searchRef}>
          <Search strokeWidth={1.5} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Mostrador Inteligente (Buscar...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full h-10 pl-9 pr-14 text-sm bg-muted/50 border border-transparent rounded-lg focus:bg-background focus:border-border focus:ring-1 focus:ring-ring transition-all outline-none text-foreground placeholder:text-muted-foreground relative z-10"
          />
          {mounted && !isSearchFocused && !searchQuery && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center z-10">
              <kbd className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 font-mono text-[10px] font-medium text-muted-foreground h-6 shadow-sm pointer-events-none">
                Ctrl K
              </kbd>
            </div>
          )}

          {/* Search Dropdown */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-2">
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">Resultados</div>
                {searchResults.length > 0 ? (
                  searchResults.map((result, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        router.push(result.href);
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-teal-500/30">
                        <result.icon className="w-4 h-4 text-muted-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{result.title}</p>
                        <p className="text-xs text-muted-foreground">{result.type}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                    No se encontraron resultados para "{searchQuery}"
                  </div>
                )}
              </div>
              <div className="p-3 bg-accent/30 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↓</kbd> Navegar</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↵</kbd> Seleccionar</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            {theme === 'dark' ? <Sun strokeWidth={1.5} className="w-4 h-4" /> : <Moon strokeWidth={1.5} className="w-4 h-4" />}
          </button>
        )}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative"
          >
            <Bell strokeWidth={1.5} className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-foreground rounded-full border-2 border-background"></span>
          </button>
          
          {mounted && isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
              <div className="p-4 border-b border-border flex justify-between items-center bg-accent/30">
                <h3 className="font-semibold text-sm text-foreground">Notificaciones</h3>
                <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Marcar leídas</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors">
                  <p className="text-sm text-foreground font-medium">Alerta de Stock Mínimo</p>
                  <p className="text-xs text-muted-foreground mt-1">Cemento Argos Uso General (50kg) bajó de 20 bultos en Sede Norte.</p>
                  <p className="text-[10px] text-muted-foreground mt-2">Hace 10 min</p>
                </div>
                <div className="p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors">
                  <p className="text-sm text-foreground font-medium">Nuevo Usuario Registrado</p>
                  <p className="text-xs text-muted-foreground mt-1">Carlos Restrepo (Bodega) ha iniciado sesión por primera vez.</p>
                  <p className="text-[10px] text-muted-foreground mt-2">Hace 1 hora</p>
                </div>
                <div className="p-4 hover:bg-accent/50 cursor-pointer transition-colors">
                  <p className="text-sm text-foreground font-medium">Actualización del Sistema</p>
                  <p className="text-xs text-muted-foreground mt-1">Módulo Triadix Shield actualizado a la versión 1.2.</p>
                  <p className="text-[10px] text-muted-foreground mt-2">Hace 2 horas</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
