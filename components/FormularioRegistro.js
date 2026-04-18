'use client';

import { useState, useEffect, useCallback } from 'react';

// Calcula la edad en años a partir de una fecha "YYYY-MM-DD"
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '';
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad >= 0 ? edad : '';
}

const ESPECIALIDADES = [
  'Medicina General',
  'Cardiología',
  'Dermatología',
  'Endocrinología',
  'Gastroenterología',
  'Ginecología',
  'Nefrología',
  'Neurología',
  'Oftalmología',
  'Ortopedia',
  'Otorrinolaringología',
  'Pediatría',
  'Psicología',
  'Psiquiatría',
  'Traumatología',
  'Urología',
  'Otra',
];

const ESTADO_INICIAL = {
  cedula: '',
  nombre: '',
  fechaNacimiento: '',
  edad: '',
  telefono: '',
  email: '',
  direccion: '',
  especialidad: '',
  cirugiaPendiente: 'Sí',
  diagnostico: '',
  observaciones: '',
};

export default function FormularioRegistro({ isEmbedded = false }) {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [errores, setErrores] = useState({});
  const [cedulaStatus, setCedulaStatus] = useState(null); // null | 'ok' | 'error'
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null); // null | { tipo: 'exito' | 'error', mensaje }
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const validarCedula = useCallback((valor) => {
    if (!valor) return 'La cédula es obligatoria.';
    if (!/^\d+$/.test(valor)) return 'Solo se permiten números.';
    if (valor.length < 6 || valor.length > 12) return 'Debe tener entre 6 y 12 dígitos.';
    return null;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formateo automático de fecha DD/MM/AAAA mientras escribe
    if (name === 'fechaNacimiento') {
      let v = value.replace(/\D/g, '').slice(0, 8);
      if (v.length >= 5) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
      else if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
      setForm(prev => ({ ...prev, [name]: v }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));

    // Validación en tiempo real solo para cédula
    if (name === 'cedula') {
      const err = validarCedula(value);
      setCedulaStatus(err ? 'error' : (value ? 'ok' : null));
      setErrores(prev => ({ ...prev, cedula: err }));
    } else {
      if (errores[name]) {
        setErrores(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const validarForm = () => {
    const nuevosErrores = {};

    const errCedula = validarCedula(form.cedula);
    if (errCedula) nuevosErrores.cedula = errCedula;

    if (!form.nombre.trim() || form.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    }

    if (!form.fechaNacimiento || form.fechaNacimiento.length < 10) {
      nuevosErrores.fechaNacimiento = 'Use el formato DD/MM/AAAA.';
    }

    if (!form.edad) {
      nuevosErrores.edad = 'La edad es obligatoria.';
    }

    if (!form.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio.';
    } else {
      const telLimpio = form.telefono.replace(/\D/g, '');
      // Validar códigos de Venezuela incluyendo 0422 solicitado
      const regexTel = /^(0412|0414|0424|0416|0426|0422|02\d{2})\d{7}$/;
      if (!regexTel.test(telLimpio)) {
        nuevosErrores.telefono = 'Número no reconocido (ej: 04121234567).';
      }
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nuevosErrores.email = 'Correo electrónico inválido.';
    }

    if (!form.especialidad) {
      nuevosErrores.especialidad = 'Este campo es obligatorio.';
    }

    if (!form.cirugiaPendiente) {
      nuevosErrores.cirugiaPendiente = 'Este campo es obligatorio.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultado(null);

    if (!validarForm()) return;

    setEnviando(true);
    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setResultado({ tipo: 'exito', mensaje: '¡Registro guardado exitosamente! El personal lo contactará pronto.' });
        setForm(ESTADO_INICIAL);
        setCedulaStatus(null);
        setErrores({});
      } else {
        setResultado({ tipo: 'error', mensaje: data.error || 'Error al guardar. Intente nuevamente.' });
      }
    } catch {
      setResultado({ tipo: 'error', mensaje: 'Error de conexión. Verifique su internet.' });
    } finally {
      setEnviando(false);
    }
  };

  const inputClass = (campo) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 placeholder-gray-400 text-gray-900 ${
      errores[campo]
        ? 'border-red-400 focus:ring-red-200 bg-red-50'
        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500 bg-white'
    }`;

  return (
    <div className={isEmbedded ? "max-w-4xl mx-auto" : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4"}>
      <div className={isEmbedded ? "" : "max-w-3xl mx-auto"}>

        {/* Encabezado - Solo se muestra si no está embebido */}
        {!isEmbedded && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4 shadow-lg shadow-blue-200">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">INFOGET</h1>
            <p className="text-gray-500 text-sm">Sistema de Registro</p>
          </div>
        )}

        {/* Banner de resultado */}
        {resultado && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${
            resultado.tipo === 'exito'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {resultado.tipo === 'exito' ? (
              <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {resultado.mensaje}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Sección: Identificación */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-4">
                Identificación
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Cédula con indicador */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    1. Cédula de Identidad <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="cedula"
                      name="cedula"
                      type="text"
                      inputMode="numeric"
                      maxLength={12}
                      value={form.cedula}
                      onChange={handleChange}
                      placeholder="Ej: 12345678"
                      className={inputClass('cedula')}
                    />
                    {cedulaStatus && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${cedulaStatus === 'ok' ? 'text-green-500' : 'text-red-500'}`}>
                        {cedulaStatus === 'ok' ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                  {errores.cedula && <p className="mt-1 text-xs text-red-600">{errores.cedula}</p>}
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    2. Nombre y Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="ej: Pedro Pérez"
                    className={inputClass('nombre')}
                  />
                  {errores.nombre && <p className="mt-1 text-xs text-red-600">{errores.nombre}</p>}
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    3. Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="text"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                    className={inputClass('fechaNacimiento')}
                  />
                  {errores.fechaNacimiento && <p className="mt-1 text-xs text-red-600">{errores.fechaNacimiento}</p>}
                </div>

                {/* Edad (Manual) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    4. Edad (años) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edad"
                    name="edad"
                    type="text"
                    inputMode="numeric"
                    value={form.edad}
                    onChange={handleChange}
                    placeholder="Ej: 65"
                    className={inputClass('edad')}
                  />
                  {errores.edad && <p className="mt-1 text-xs text-red-600">{errores.edad}</p>}
                </div>
              </div>
            </div>

            {/* Sección: Contacto */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-4">
                Datos de Contacto
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    5. Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 04121234567"
                    className={inputClass('telefono')}
                  />
                  {errores.telefono && <p className="mt-1 text-xs text-red-600">{errores.telefono}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    6. Correo Electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className={inputClass('email')}
                  />
                  {errores.email && <p className="mt-1 text-xs text-red-600">{errores.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    7. Dirección
                  </label>
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Dirección de habitación"
                    className={inputClass('direccion')}
                  />
                </div>
              </div>
            </div>

            {/* Sección: Médica */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-4">
                Información Médica
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    8. Especialidad <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="especialidad"
                    name="especialidad"
                    value={form.especialidad}
                    onChange={handleChange}
                    className={inputClass('especialidad')}
                  >
                    <option value="">Seleccione...</option>
                    {ESPECIALIDADES.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                  {errores.especialidad && <p className="mt-1 text-xs text-red-600">{errores.especialidad}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    9. ¿Cirugía Pendiente? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="cirugiaPendiente"
                    name="cirugiaPendiente"
                    value={form.cirugiaPendiente}
                    onChange={handleChange}
                    className={inputClass('cirugiaPendiente')}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                    <option value="En evaluación">En evaluación</option>
                  </select>
                  {errores.cirugiaPendiente && <p className="mt-1 text-xs text-red-600">{errores.cirugiaPendiente}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    10. Diagnóstico
                  </label>
                  <textarea
                    id="diagnostico"
                    name="diagnostico"
                    rows={2}
                    value={form.diagnostico}
                    onChange={handleChange}
                    placeholder="Diagnóstico médico (opcional)"
                    className={`${inputClass('diagnostico')} resize-none`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    11. Observaciones
                  </label>
                  <textarea
                    id="observaciones"
                    name="observaciones"
                    rows={3}
                    value={form.observaciones}
                    onChange={handleChange}
                    placeholder="Observaciones adicionales (opcional)"
                    className={`${inputClass('observaciones')} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* Botón Submit */}
            <div className="px-6 py-5">
              {/* Casilla de consentimiento legal (Requisito para evitar bloqueos) */}
              <div className="mb-4">
                <label className="flex items-start gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 leading-tight group-hover:text-gray-900 transition-colors">
                    Doy mi consentimiento voluntario para que INFOGET procese mis datos personales exclusivamente con fines de registro administrativo y atención médica.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                id="btn-registrar"
                disabled={enviando || !aceptaTerminos}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:shadow-none text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Registrar Paciente
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-gray-400">
                Los campos con <span className="text-red-500">*</span> son obligatorios
              </p>
            </div>
          </div>
        </form>

        {/* Disclaimer final para generar confianza en sistemas automáticos */}
        <div className="mt-8 text-center bg-gray-50/50 rounded-xl p-4 border border-dashed border-gray-200">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-1">Aviso de Privacidad</p>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            INFOGET es una plataforma privada de captura de datos voluntaria. No solicitamos contraseñas, datos bancarios ni información financiera. Sus datos están protegidos por protocolos de seguridad internos.
          </p>
        </div>
      </div>
    </div>
  );
}
