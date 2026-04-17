'use client';

import { useMemo } from 'react';

export default function VistaImpresion({ pacientes = [] }) {
  // Ordenar por cédula (ascendente)
  const pacientesOrdenados = useMemo(() => {
    return [...pacientes].sort((a, b) => {
      const numA = parseInt(a.cedula.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.cedula.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [pacientes]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Estilos para impresión */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: landscape;
            margin: 1cm;
          }
          body * {
            visibility: hidden;
          }
          #seccion-impresion, #seccion-impresion * {
            visibility: visible;
          }
          #seccion-impresion {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="text-base font-bold text-gray-800">Vista Previa de Impresión</h2>
          <p className="text-sm text-gray-500">Datos ordenados por Cédula (Sentido Horizontal)</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir Reporte
        </button>
      </div>

      <div id="seccion-impresion" className="overflow-x-auto">
        <div className="mb-4 hidden print:block text-center border-b pb-4">
          <h1 className="text-xl font-bold text-gray-900 leading-none">INFOGET - REPORTE GENERAL DE PACIENTES</h1>
          <p className="text-xs text-gray-500 mt-1">Generado el: {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}</p>
        </div>

        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider border">Cédula</th>
              <th className="px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider border">Nombre Completo</th>
              <th className="px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider border">Edad</th>
              <th className="px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider border">Teléfono</th>
              <th className="px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider border">Especialidad</th>
              <th className="px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider border">Cirugía</th>
              <th className="px-3 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider border">Diagnóstico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pacientesOrdenados.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 print:hover:bg-transparent">
                <td className="px-3 py-2.5 text-xs text-gray-900 font-medium border">{p.cedula}</td>
                <td className="px-3 py-2.5 text-xs text-gray-700 border">{p.nombre}</td>
                <td className="px-3 py-2.5 text-xs text-gray-700 border text-center">{p.edad}</td>
                <td className="px-3 py-2.5 text-xs text-gray-700 border">{p.telefono}</td>
                <td className="px-3 py-2.5 text-xs text-gray-700 border">{p.especialidad}</td>
                <td className="px-3 py-2.5 text-xs text-gray-700 border">
                  <span className={
                    p.cirugiaPendiente === 'Sí' ? 'text-red-600 font-bold' : 
                    p.cirugiaPendiente === 'En evaluación' ? 'text-yellow-600 font-bold' : 
                    'text-gray-600'
                  }>
                    {p.cirugiaPendiente}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-xs text-gray-600 border italic max-w-xs truncate print:max-w-none print:whitespace-normal">
                  {p.diagnostico || '-'}
                </td>
              </tr>
            ))}
            {pacientesOrdenados.length === 0 && (
              <tr>
                <td colSpan="7" className="px-3 py-8 text-center text-gray-400 text-sm">
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="mt-6 hidden print:flex items-center justify-between text-[10px] text-gray-400">
          <p>Total de registros: {pacientesOrdenados.length}</p>
          <p>Infoget © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
