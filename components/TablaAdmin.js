'use client';

import { useState, useMemo } from 'react';
import ModalDetalle from './ModalDetalle';
import ModalEditar from './ModalEditar';
import * as XLSX from 'xlsx';

const COLS_POR_PAGINA = 20;

const COLUMNAS = [
  { key: 'cedula', label: 'Cédula' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'edad', label: 'Edad' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Correo' },
  { key: 'especialidad', label: 'Especialidad' },
  { key: 'cirugiaPendiente', label: 'Cirugía' },
  { key: 'fechaRegistro', label: 'Registrado' },
];

function formatFecha(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('es-VE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  } catch { return iso; }
}

export default function TablaAdmin({ pacientes, onRefresh }) {
  const [busqueda, setBusqueda] = useState('');
  const [sortCol, setSortCol] = useState('nombre');
  const [sortDir, setSortDir] = useState('asc');
  const [pagina, setPagina] = useState(1);
  const [pacienteDetalle, setPacienteDetalle] = useState(null);
  const [pacienteEditar, setPacienteEditar] = useState(null);
  const [eliminando, setEliminando] = useState(null);

  // Filtrado
  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return pacientes;
    return pacientes.filter(p =>
      p.cedula.includes(q) ||
      p.nombre.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.especialidad.toLowerCase().includes(q)
    );
  }, [pacientes, busqueda]);

  // Ordenamiento
  const ordenados = useMemo(() => {
    return [...filtrados].sort((a, b) => {
      const va = a[sortCol] ?? '';
      const vb = b[sortCol] ?? '';
      const cmp = va.localeCompare(vb, 'es', { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtrados, sortCol, sortDir]);

  // Paginación
  const totalPaginas = Math.ceil(ordenados.length / COLS_POR_PAGINA) || 1;
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * COLS_POR_PAGINA;
  const paginados = ordenados.slice(inicio, inicio + COLS_POR_PAGINA);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
    setPagina(1);
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPagina(1);
  };

  const handleEliminar = async (cedula) => {
    if (!confirm(`¿Eliminar permanentemente el paciente con cédula ${cedula}?`)) return;
    setEliminando(cedula);
    try {
      const res = await fetch(`/api/pacientes?cedula=${encodeURIComponent(cedula)}`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
      } else {
        const d = await res.json();
        alert(d.error || 'Error al eliminar.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setEliminando(null);
    }
  };

  const exportarExcel = () => {
    const datos = ordenados.map(p => ({
      Cédula: p.cedula,
      Nombre: p.nombre,
      'Fecha Nac.': p.fechaNacimiento,
      Edad: p.edad,
      Teléfono: p.telefono,
      Correo: p.email,
      Dirección: p.direccion,
      Especialidad: p.especialidad,
      'Cirugía Pendiente': p.cirugiaPendiente,
      Diagnóstico: p.diagnostico,
      Observaciones: p.observaciones,
      'Fecha Registro': formatFecha(p.fechaRegistro),
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');
    XLSX.writeFile(wb, `infoget_pacientes_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <span className="ml-1 opacity-30">↕</span>;
    return <span className="ml-1 text-blue-600">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <>
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          id="buscador-tabla"
          type="search"
          placeholder="Buscar por cédula, nombre, correo o especialidad..."
          value={busqueda}
          onChange={handleBusqueda}
          className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        />
        <div className="flex gap-2">
          <button
            id="btn-exportar-excel"
            onClick={exportarExcel}
            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Excel
          </button>
          <button
            id="btn-imprimir"
            onClick={() => window.print()}
            className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>
          <button
            id="btn-vaciar-db"
            onClick={async () => {
              if (confirm('¿ESTÁ SEGURO? Esta acción borrará TODOS los registros de la base de datos para iniciar una nueva campaña. Asegúrese de haber exportado a Excel primero.')) {
                try {
                  const res = await fetch('/api/pacientes?action=deleteAll', { method: 'POST' });
                  if (res.ok) onRefresh();
                  else alert('Error al vaciar base de datos');
                } catch { alert('Error de conexión'); }
              }
            }}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Vaciar Base
          </button>
        </div>
      </div>

      {/* Estadística rápida */}
      <p className="text-xs text-gray-400 mb-3">
        Mostrando {paginados.length} de {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''}
        {busqueda && ` para "${busqueda}"`}
      </p>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNAS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  {col.label}<SortIcon col={col.key} />
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {paginados.length === 0 ? (
              <tr>
                <td colSpan={COLUMNAS.length + 1} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              paginados.map((p) => (
                <tr key={p.cedula} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-800">{p.cedula}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{p.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{p.edad}</td>
                  <td className="px-4 py-3 text-gray-600">{p.telefono}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{p.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">
                      {p.especialidad}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
                      p.cirugiaPendiente === 'Sí' ? 'bg-red-50 text-red-700' :
                      p.cirugiaPendiente === 'En evaluación' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {p.cirugiaPendiente}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatFecha(p.fechaRegistro)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setPacienteDetalle(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors mr-1.5"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => setPacienteEditar(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors mr-1.5"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(p.cedula)}
                      disabled={eliminando === p.cedula}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {eliminando === p.cedula ? '...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Modales */}
      {pacienteDetalle && (
        <ModalDetalle paciente={pacienteDetalle} onClose={() => setPacienteDetalle(null)} />
      )}
      {pacienteEditar && (
        <ModalEditar
          paciente={pacienteEditar}
          onClose={() => setPacienteEditar(null)}
          onGuardado={() => { setPacienteEditar(null); onRefresh(); }}
        />
      )}
    </>
  );
}
