"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/erp');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm p-8 bg-zinc-950/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800/50 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 shadow-lg">
            <Image src="/logo.png" alt="Triadix" width={40} height={40} className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Triadix ERP</h1>
          <p className="text-zinc-400 text-sm mt-1.5">Acceso Corporativo</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-tight">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-400">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-white placeholder:text-zinc-600"
              placeholder="usuario@triadix.com.co"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-400">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-zinc-600 font-mono">
          Protegido por Zero Trust Shield
        </div>
      </motion.div>
    </div>
  );
}
