'use client';

import { useState, useRef } from 'react';

export default function RespaldoAdmin() {
  const [nombreRespaldo, setNombreRespaldo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [confirmarVaciado, setConfirmarVaciado] = useState('');
  const fileInputRef = useRef(null);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 8000); // 8 seconds to allow user to read
  };

  const handleExportar = async () => {
    setCargando(true);
    setMensaje(null);
    try {
      const res = await fetch('/api/backup');
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error al exportar');
      if (data.length === 0) throw new Error('No hay registros en la base de datos para respaldar.');

      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      
      let nombreArc = nombreRespaldo.trim() 
            ? nombreRespaldo.replace(/[^a-z0-9_ -]/gi, '').replace(/\s+/g, '_') 
            : new Date().toISOString().slice(0,10);
            
      a.download = `Infoget_Backup_${nombreArc}.json`;
      a.click();
      URL.revokeObjectURL(url);
      mostrarMensaje('exito', '¡Archivo de respaldo descargado exitosamente! Ahora está a salvo en tu computadora.');
    } catch (error) {
      mostrarMensaje('error', error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleImportar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCargando(true);
    setMensaje(null);
    try {
      const text = await file.text();
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (err) {
        throw new Error('El archivo seleccionado no es un JSON válido o está corrupto.');
      }

      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      const resData = await res.json();

      if (!res.ok) throw new Error(resData.error || 'Error al restaurar los datos.');

      mostrarMensaje('exito', resData.message || 'Restauración completada.');
      if(fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      mostrarMensaje('error', error.message);
      if(fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setCargando(false);
    }
  };

  const handleVaciar = async () => {
    if (confirmarVaciado !== 'VACIAR') {
      mostrarMensaje('error', 'Debes escribir "VACIAR" para confirmar.');
      return;
    }

    if (!confirm('¿ESTÁ COMPLETAMENTE SEGURO? Esta acción no se puede deshacer a menos que posea el archivo de respaldo descargable.')) {
      return;
    }

    setCargando(true);
    setMensaje(null);
    try {
      const res = await fetch('/api/pacientes?action=deleteAll', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error al vaciar BD');

      setConfirmarVaciado('');
      mostrarMensaje('exito', 'Base de datos vaciada y lista para una nueva campaña o uso.');
    } catch (error) {
      mostrarMensaje('error', error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Respaldo y Restauración del Sistema</h2>
          <p className="text-sm text-gray-500 mt-1">
            Reutiliza la plataforma para diferentes proyectos (cartuchos) usando el sistema de respaldos de datos.
          </p>
        </div>

        {mensaje && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium border-l-4 ${
            mensaje.tipo === 'exito' ? 'bg-green-50 text-green-800 border-green-500' : 'bg-red-50 text-red-800 border-red-500'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* PANEL EXPORTAR */}
            <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl hover:shadow-md transition">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Paso 1: Generar Respaldo
                </h3>
                <p className="text-xs text-blue-800 mb-4 opacity-80">
                    Descarga toda la información recopilada hasta este momento en un archivo digital seguro (JSON).
                </p>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Nombre de Campaña (Opcional)</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-blue-300 focus:ring-blue-100 transition" 
                            placeholder="Ej: Jubilados_Operaciones_2026"
                            value={nombreRespaldo}
                            onChange={(e) => setNombreRespaldo(e.target.value)}
                            disabled={cargando}
                        />
                    </div>
                    <button 
                        onClick={handleExportar}
                        disabled={cargando}
                        className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                        {cargando ? 'Procesando...' : 'Descargar Datos Actuales'}
                    </button>
                </div>
            </div>

            {/* PANEL RESTAURAR */}
            <div className="p-5 bg-green-50/50 border border-green-100 rounded-xl hover:shadow-md transition">
                <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Paso 3: Restaurar Cartucho
                </h3>
                <p className="text-xs text-green-800 mb-4 opacity-80">
                    Sube un archivo de datos (previamente generado en el Paso 1) para volver a disponer de sus registros.
                </p>
                <div className="space-y-3 mt-[3.1rem]">
                    <input 
                        type="file" 
                        accept=".json"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImportar}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={cargando}
                        className="w-full px-4 py-2.5 bg-white hover:bg-green-50 border border-gray-300 hover:border-green-300 text-gray-800 hover:text-green-800 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Seleccionar archivo de PC
                    </button>
                    <p className="text-[10px] text-center text-gray-500 font-medium">
                        * Se aconseja realizarlo sobre una base limpia.
                    </p>
                </div>
            </div>
        </div>

        {/* ZONA DE PELIGRO: VACIAR */}
        <div className="mt-8 pt-6 border-t border-red-100 bg-red-50/50 -mx-6 -mb-6 p-6">
            <h3 className="font-bold text-red-900 mb-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Paso 2: Zona de Peligro (Formatear BD)
            </h3>
            <p className="text-xs text-red-800 mb-4 leading-relaxed max-w-2xl font-medium">
                Borrará toda información de la base de datos de manera definitiva. Esto debe hacerse luego del "Paso 1".
                Para asegurar que no sea un clic accidental, escribe exactamente <span className="font-black">VACIAR</span> debajo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <input 
                    type="text" 
                    placeholder="Escribe VACIAR"
                    value={confirmarVaciado}
                    onChange={(e) => setConfirmarVaciado(e.target.value.toUpperCase())}
                    disabled={cargando}
                    className="px-4 py-2.5 w-full sm:w-48 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 border border-red-200 bg-white rounded-lg text-red-600 font-black tracking-widest placeholder-red-300 transition"
                />
                <button
                    onClick={handleVaciar}
                    disabled={cargando || confirmarVaciado !== 'VACIAR'}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                    {cargando ? 'Borrando...' : 'Formatear y Limpiar'}
                </button>
            </div>
        </div>
      </div>
  );
}
