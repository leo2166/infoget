'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState('idle'); // 'idle' | 'cargando' | 'error'
  const router = useRouter();
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado('cargando');

    const result = await signIn('credentials', {
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.replace('/admin');
    } else {
      // Mostrar pantalla roja
      setEstado('error');

      // Reproducir sonido de error
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
      } catch { /* silencioso si el navegador bloquea */ }

      // Redirigir a inicio después de 1.5s
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    }
  };

  // Pantalla roja de error
  if (estado === 'error') {
    return (
      <div className="fixed inset-0 bg-red-600 flex flex-col items-center justify-center z-50 animate-pulse">
        <svg className="w-24 h-24 text-white mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <p className="text-white text-3xl font-black tracking-widest">ACCESO DENEGADO</p>
        <p className="text-white/70 text-sm mt-3">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">INFOGET</h1>
          <p className="text-sm text-white/50 mt-1">Panel de Administración</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-white/60 mb-2">Contraseña de acceso</label>
            <input
              id="input-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoFocus
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            id="btn-ingresar"
            type="submit"
            disabled={estado === 'cargando' || !password}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-700/30 flex items-center justify-center gap-2"
          >
            {estado === 'cargando' ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Verificando...
              </>
            ) : 'Ingresar'}
          </button>
        </form>

        <p className="text-xs text-white/25 text-center mt-6">
          Solo el administrador autorizado puede acceder.
        </p>
      </div>
    </div>
  );
}
