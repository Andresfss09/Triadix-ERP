"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users, 
  BarChart3, 
  Settings,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Panel Principal', href: '/erp', icon: LayoutDashboard, roles: ['Admin', 'Vendedor'] },
  { name: 'Mostrador (POS)', href: '/erp/pos', icon: ShoppingCart, roles: ['Admin', 'Vendedor'] },
  { name: 'Inventario', href: '/erp/inventory', icon: Package, roles: ['Admin'] },
  { name: 'Ventas y Pedidos', href: '/erp/sales', icon: BarChart3, roles: ['Admin', 'Vendedor'] },
  { name: 'Compras y Traslados', href: '/erp/logistics', icon: Truck, roles: ['Admin'] },
  { name: 'CRM Clientes', href: '/erp/crm', icon: Users, roles: ['Admin', 'Vendedor'] },
  { name: 'Reportes', href: '/erp/reports', icon: BarChart3, roles: ['Admin'] },
  { name: 'Centro de Seguridad', href: '/erp/shield', icon: ShieldCheck, roles: ['Admin'] },
  { name: 'Motor IA (Mind)', href: '/erp/mind', icon: Cpu, roles: ['Admin'] },
  { name: 'Administración', href: '/erp/settings', icon: Settings, roles: ['Admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState({
    name: 'Cargando...',
    initials: '--',
    role: 'Admin', // default to Admin so it doesn't flash empty sidebar
    address: 'Principal Norte',
    avatar: ''
  });

  useEffect(() => {
    async function loadUser() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        const fullName = meta.full_name || 'Usuario Triadix';
        
        // Calculate initials
        const parts = fullName.trim().split(' ');
        let inits = 'U';
        if (parts.length >= 2) {
          inits = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts.length === 1 && parts[0].length > 0) {
          inits = parts[0][0].toUpperCase();
        }

        setProfile({
          name: fullName,
          initials: inits,
          role: meta.role || 'Admin',
          address: meta.address || 'Principal Norte',
          avatar: meta.avatar_url || ''
        });
      }
    }
    
    loadUser();
    
    window.addEventListener('profileUpdated', loadUser);
    return () => window.removeEventListener('profileUpdated', loadUser);
  }, []);

  const filteredNavItems = navItems.filter(item => item.roles.includes(profile.role));

  return (
    <aside className="w-64 bg-zinc-950 dark:bg-black text-zinc-400 flex flex-col h-screen border-r border-zinc-800/50 relative z-20 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
        <Link href="/erp" className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center bg-white rounded-md overflow-hidden p-1">
            <Image src="/logo.png" alt="Triadix Logo" width={24} height={24} className="object-contain" />
          </div>
          <span className="font-semibold text-white tracking-tight text-lg">Triadix</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3 text-sm font-medium">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'text-white bg-zinc-800/50' 
                    : 'hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active" 
                    className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon strokeWidth={1.5} className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-5 border-t border-zinc-800/50 bg-zinc-950/50">
        <UserProfile profile={profile} />
      </div>
    </aside>
  );
}

function UserProfile({ profile }: { profile: any }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden shrink-0">
        {profile.avatar ? (
          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-medium text-white">{profile.initials}</span>
        )}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <span className="text-sm font-medium text-white truncate">{profile.name}</span>
        <span className="text-xs text-zinc-500 truncate">{profile.role}</span>
      </div>
      <button 
        onClick={async () => {
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          await supabase.auth.signOut();
          window.location.href = '/auth';
        }}
        className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
        title="Cerrar Sesión"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
      </button>
    </div>
  );
}
