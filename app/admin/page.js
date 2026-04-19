'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import TablaAdmin from '@/components/TablaAdmin';
import FormularioRegistro from '@/components/FormularioRegistro';
import VistaImpresion from '@/components/VistaImpresion';
import RespaldoAdmin from '@/components/RespaldoAdmin';

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AdminContent />
    </Suspense>
  );
}

function AdminContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'gestion';

  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab); // 'captura' | 'gestion' | 'impresion'

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('/api/pacientes');
      if (!res.ok) throw new Error('No se pudieron cargar los registros.');
      const data = await res.json();
      setPacientes(data.pacientes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      cargarDatos();
    }
  }, [status, cargarDatos]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          Verificando acceso...
        </div>
      </div>
    );
  }

  // Calcular estadísticas
  const totalPacientes = pacientes.length;
  const conCirugia = pacientes.filter(p => p.cirugiaPendiente === 'Sí').length;
  const enEvaluacion = pacientes.filter(p => p.cirugiaPendiente === 'En evaluación').length;
  const especialidades = new Set(pacientes.map(p => p.especialidad).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">INFOGET</span>
            <span className="hidden sm:inline text-xs text-gray-400 ml-1">Panel de Administración</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {session?.user?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="Avatar" className="w-7 h-7 rounded-full" />
              )}
              <span className="text-sm text-gray-600">{session?.user?.name}</span>
            </div>
            <button
              id="btn-cerrar-sesion"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-3 py-1.5 text-sm bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-bold transition-colors shadow-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-all duration-300">
        
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm mb-6 w-fit no-print">
          {[
            { id: 'captura', label: 'Captura de Datos', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            )},
            { id: 'gestion', label: 'Gestión de Datos', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            )},
            { id: 'impresion', label: 'Impresión', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            )},
            { id: 'respaldo', label: 'Respaldo', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            )},
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {tab.icon}
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'captura' && (
          <div className="animate-fadeIn">
            <FormularioRegistro isEmbedded={true} />
          </div>
        )}

        {activeTab === 'gestion' && (
          <div className="animate-fadeIn">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Pacientes', valor: totalPacientes, color: 'blue', icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                )},
                { label: 'Cirugía Pendiente', valor: conCirugia, color: 'red', icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )},
                { label: 'En Evaluación', valor: enEvaluacion, color: 'yellow', icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                )},
                { label: 'Especialidades', valor: especialidades, color: 'green', icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                )},
              ].map(({ label, valor, color, icon }) => (
                <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-${color}-50 flex items-center justify-center shrink-0`}>
                      <svg className={`w-5 h-5 text-${color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {icon}
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{cargando ? '—' : valor}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel tabla */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-800">Registros de Pacientes</h2>
                <button
                  id="btn-actualizar"
                  onClick={cargarDatos}
                  disabled={cargando}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {cargando ? 'Cargando...' : 'Actualizar'}
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              {cargando && pacientes.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">
                  <svg className="animate-spin w-6 h-6 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Cargando registros...
                </div>
              ) : (
                <TablaAdmin pacientes={pacientes} onRefresh={cargarDatos} />
              )}
            </div>
          </div>
        )}

        {activeTab === 'impresion' && (
          <div className="animate-fadeIn">
            <VistaImpresion pacientes={pacientes} />
          </div>
        )}

        {activeTab === 'respaldo' && (
          <div className="animate-fadeIn">
            <RespaldoAdmin />
          </div>
        )}
      </main>
    </div>
  );
}
