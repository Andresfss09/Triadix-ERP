"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, SlidersHorizontal, Key, Users, Building, FileText, CheckCircle2, Shield, Plus, MoreHorizontal } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';

export default function SettingsModule() {
  const [activeTab, setActiveTab] = useState("preferencias");

  const tabs = [
    { id: "perfil", label: "Mi Perfil", icon: Users },
    { id: "preferencias", label: "Preferencias", icon: SlidersHorizontal },
    { id: "usuarios", label: "Usuarios (Auth)", icon: Users },
    { id: "licencias", label: "Licencias & Plan", icon: Key },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 max-w-6xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2 text-foreground">
            <Settings className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} /> Administración
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Ajustes globales, seguridad y configuración del ERP Triadix</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative
                  ${isActive ? "text-foreground bg-accent" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute left-0 w-1 h-5 bg-foreground rounded-r-full"
                  />
                )}
                <Icon className="w-4 h-4" strokeWidth={1.5} /> 
                {tab.label}
              </button>
            );
          })}
        </div>
        
        {/* Tab Content */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
            >
              {activeTab === "perfil" && <PerfilTab />}
              {activeTab === "preferencias" && <PreferenciasTab />}
              {activeTab === "usuarios" && <UsuariosTab />}
              {activeTab === "licencias" && <LicenciasTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function PreferenciasTab() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-lg font-medium text-foreground">Parámetros Tributarios (Colombia)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">IVA General (%)</label>
            <input 
              type="number" 
              defaultValue={19} 
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Moneda Base</label>
            <input 
              type="text" 
              disabled 
              defaultValue="COP (Peso Colombiano)" 
              className="w-full bg-accent/50 border border-border rounded-lg px-4 py-2.5 text-muted-foreground cursor-not-allowed" 
            />
          </div>
        </div>
      </div>
      
      <div className="w-full h-px bg-border/50" />
      
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-lg font-medium text-foreground">Resolución de Facturación DIAN</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Número de Resolución Activa</label>
            <input 
              type="text" 
              defaultValue="18764000000001" 
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Prefijo Asignado</label>
              <input 
                type="text" 
                defaultValue="FAC" 
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all uppercase" 
              />
            </div>
            <div className="flex-[2] space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Rango (Desde - Hasta)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  defaultValue={1} 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
                />
                <span className="text-muted-foreground">—</span>
                <input 
                  type="number" 
                  defaultValue={10000} 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button className="px-6 py-2.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

function UsuariosTab() {
  const users = [
    { name: "Andrés Silva", email: "admin@triadix.com", role: "Super Admin", status: "Activo" },
    { name: "Carolina Gómez", email: "ventas@triadix.com", role: "Vendedor", status: "Activo" },
    { name: "Carlos Restrepo", email: "bodega@triadix.com", role: "Almacén", status: "Inactivo" },
  ];

  return (
    <div className="p-0">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-foreground">Gestión de Usuarios</h2>
          <p className="text-sm text-muted-foreground mt-1">Administra los accesos y roles del personal al ERP.</p>
        </div>
        <button className="px-4 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Nuevo Usuario
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-accent/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Usuario</th>
              <th className="px-6 py-4 font-medium">Correo Electrónico</th>
              <th className="px-6 py-4 font-medium">Rol</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user, idx) => (
              <tr key={idx} className="hover:bg-accent/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-accent rounded-md text-xs font-medium text-foreground border border-border">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${user.status === 'Activo' ? 'text-green-500' : 'text-muted-foreground'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Activo' ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
                    <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LicenciasTab() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start justify-between gap-4 p-5 border border-border rounded-xl bg-accent/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-bl-[100px] -z-10" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            <h2 className="text-lg font-medium text-foreground">Licencia Activa</h2>
          </div>
          <p className="text-sm text-muted-foreground">Tu plan actual y detalles de facturación.</p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-foreground text-background rounded-full text-xs font-semibold uppercase tracking-wider">
            Triadix Enterprise
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 border border-border rounded-xl space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Límites de Uso</label>
          <div className="flex justify-between items-end mt-2">
            <div className="text-2xl font-semibold text-foreground">3 / 10</div>
            <div className="text-sm text-muted-foreground">Usuarios</div>
          </div>
          <div className="w-full bg-accent h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-foreground w-[30%] h-full rounded-full" />
          </div>
        </div>
        
        <div className="p-5 border border-border rounded-xl space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Almacenamiento (Supabase)</label>
          <div className="flex justify-between items-end mt-2">
            <div className="text-2xl font-semibold text-foreground">1.2 GB</div>
            <div className="text-sm text-muted-foreground">de 5 GB</div>
          </div>
          <div className="w-full bg-accent h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-foreground w-[24%] h-full rounded-full" />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-border mt-6">
        <div className="text-sm text-muted-foreground">
          Renovación automática el <strong>15 de Enero, 2027</strong>
        </div>
        <button className="px-4 py-2 bg-background border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-all text-sm">
          Administrar Plan
        </button>
      </div>
    </div>
  );
}



function PerfilTab() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    cedula: '',
    email: '',
    phone: '',
    address: '',
    avatar_url: '',
    role: 'Admin'
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user) {
          const meta = user.user_metadata || {};
          
          setFormData({
            email: user.email || '',
            full_name: meta.full_name || '',
            cedula: meta.cedula || '',
            phone: meta.phone || '',
            address: meta.address || '',
            avatar_url: meta.avatar_url || '',
            role: meta.role || 'Admin'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadProfile();
  }, [supabase]);
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create a canvas to resize the image to a small thumbnail to easily fit in metadata
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 128;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setFormData(prev => ({ ...prev, avatar_url: dataUrl }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Save directly to auth.users metadata. This is natively supported by Supabase, 
      // bypasses RLS issues, and doesn't require modifying the public profiles table schema.
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          cedula: formData.cedula,
          phone: formData.phone,
          address: formData.address,
          avatar_url: formData.avatar_url,
          role: formData.role
        }
      });
      
      if (error) throw error;
      
      window.dispatchEvent(new Event('profileUpdated'));
      alert('¡Perfil actualizado de verdad en la base de datos!');
    } catch (err: any) {
      alert('Error guardando: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-10 text-center text-muted-foreground animate-pulse">Cargando datos del perfil...</div>;
  }

  return (
    <form onSubmit={handleSave} className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-lg font-medium text-foreground">Datos Personales</h2>
        </div>
        
        {/* Profile Picture Upload */}
        <div className="mb-8 flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full bg-accent flex items-center justify-center border-2 border-border overflow-hidden group">
            {formData.avatar_url ? (
              <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
            )}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-xs text-white font-medium">Cambiar</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">Foto de Perfil</h3>
            <p className="text-xs text-muted-foreground">Sube una foto profesional. Recomendado: 256x256px.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
            <input 
              type="text" 
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Cédula de Ciudadanía</label>
            <input 
              type="text" 
              value={formData.cedula}
              onChange={(e) => setFormData({...formData, cedula: e.target.value})}
              placeholder="Ej. 1000234567" 
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Correo Electrónico</label>
            <input 
              type="email" 
              value={formData.email}
              disabled
              className="w-full bg-accent/50 border border-border rounded-lg px-4 py-2.5 text-muted-foreground cursor-not-allowed" 
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Número de Teléfono</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Ej. 310 123 4567" 
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Dirección de la Empresa / Sede</label>
            <input 
              type="text" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Ej. Calle 123 # 45 - 67, Sede Norte" 
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Rol en el Sistema (Prueba)</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all" 
            >
              <option value="Admin">Administrador (Acceso Total)</option>
              <option value="Vendedor">Vendedor (Acceso Restringido)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-border mt-6">
        <button disabled={loading} type="submit" className="px-6 py-2.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all flex items-center gap-2">
          {loading ? (
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}
