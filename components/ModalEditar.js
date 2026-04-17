'use client';

import { useState, useEffect } from 'react';

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '';
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad >= 0 ? edad : '';
}

const ESPECIALIDADES = [
  'Medicina General','Cardiología','Dermatología','Endocrinología','Gastroenterología',
  'Ginecología','Nefrología','Neurología','Oftalmología','Ortopedia',
  'Otorrinolaringología','Pediatría','Psicología','Psiquiatría','Traumatología','Urología','Otra',
];

export default function ModalEditar({ paciente, onClose, onGuardado }) {
  const [form, setForm] = useState({ ...paciente });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (form.fechaNacimiento) {
      setForm(prev => ({ ...prev, edad: calcularEdad(form.fechaNacimiento) }));
    }
  }, [form.fechaNacimiento]);

  if (!paciente) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: null }));
  };

  const validar = () => {
    const e = {};
    if (!form.cedula || !/^\d{6,12}$/.test(form.cedula)) e.cedula = 'Cédula inválida (6-12 dígitos).';
    if (!form.nombre?.trim() || form.nombre.trim().length < 2) e.nombre = 'Nombre obligatorio.';
    if (!form.fechaNacimiento) e.fechaNacimiento = 'Fecha de nacimiento obligatoria.';
    if (!form.telefono?.trim() || !/^\d{7,15}$/.test(form.telefono.replace(/\D/g, ''))) e.telefono = 'Teléfono inválido.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido.';
    if (!form.especialidad) e.especialidad = 'Seleccione una especialidad.';
    if (!form.cirugiaPendiente) e.cirugiaPendiente = 'Campo obligatorio.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = async () => {
    setError(null);
    if (!validar()) return;

    setGuardando(true);
    try {
      const res = await fetch('/api/pacientes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedulaOriginal: paciente.cedula, ...form }),
      });

      const data = await res.json();
      if (res.ok) {
        onGuardado();
      } else {
        setError(data.error || 'Error al actualizar.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setGuardando(false);
    }
  };

  const inputClass = (campo) =>
    `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${
      errores[campo]
        ? 'border-red-400 focus:ring-red-200 bg-red-50'
        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500 bg-white'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Editar Paciente</h2>
            <p className="text-xs text-gray-400 mt-0.5">Cédula original: {paciente.cedula}</p>
          </div>
          <button
            id="btn-cerrar-editar"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cédula */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Cédula *</label>
              <input name="cedula" type="text" inputMode="numeric" maxLength={12}
                value={form.cedula} onChange={handleChange} className={inputClass('cedula')} />
              {errores.cedula && <p className="mt-1 text-xs text-red-600">{errores.cedula}</p>}
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Nombre *</label>
              <input name="nombre" type="text" value={form.nombre} onChange={handleChange} className={inputClass('nombre')} />
              {errores.nombre && <p className="mt-1 text-xs text-red-600">{errores.nombre}</p>}
            </div>

            {/* Fecha nacimiento */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Fecha Nac. *</label>
              <input name="fechaNacimiento" type="date" value={form.fechaNacimiento}
                onChange={handleChange} max={new Date().toISOString().split('T')[0]}
                className={inputClass('fechaNacimiento')} />
              {errores.fechaNacimiento && <p className="mt-1 text-xs text-red-600">{errores.fechaNacimiento}</p>}
            </div>

            {/* Edad (readonly) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Edad</label>
              <input type="text" value={form.edad} readOnly
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Teléfono *</label>
              <input name="telefono" type="tel" value={form.telefono} onChange={handleChange} className={inputClass('telefono')} />
              {errores.telefono && <p className="mt-1 text-xs text-red-600">{errores.telefono}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Correo</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass('email')} />
              {errores.email && <p className="mt-1 text-xs text-red-600">{errores.email}</p>}
            </div>

            {/* Dirección */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Dirección</label>
              <input name="direccion" type="text" value={form.direccion} onChange={handleChange} className={inputClass('direccion')} />
            </div>

            {/* Especialidad */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Especialidad *</label>
              <select name="especialidad" value={form.especialidad} onChange={handleChange} className={inputClass('especialidad')}>
                <option value="">Seleccione...</option>
                {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              {errores.especialidad && <p className="mt-1 text-xs text-red-600">{errores.especialidad}</p>}
            </div>

            {/* Cirugía */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Cirugía Pendiente *</label>
              <select name="cirugiaPendiente" value={form.cirugiaPendiente} onChange={handleChange} className={inputClass('cirugiaPendiente')}>
                <option value="">Seleccione...</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
                <option value="En evaluación">En evaluación</option>
              </select>
              {errores.cirugiaPendiente && <p className="mt-1 text-xs text-red-600">{errores.cirugiaPendiente}</p>}
            </div>

            {/* Diagnóstico */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Diagnóstico</label>
              <textarea name="diagnostico" rows={2} value={form.diagnostico}
                onChange={handleChange} className={`${inputClass('diagnostico')} resize-none`} />
            </div>

            {/* Observaciones */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Observaciones</label>
              <textarea name="observaciones" rows={3} value={form.observaciones}
                onChange={handleChange} className={`${inputClass('observaciones')} resize-none`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            id="btn-guardar-edicion"
            onClick={handleGuardar}
            disabled={guardando}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {guardando ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Guardando...
              </>
            ) : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
