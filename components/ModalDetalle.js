'use client';

function formatFecha(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('es-VE', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch { return iso; }
}

const CAMPOS = [
  { key: 'cedula', label: 'Cédula de Identidad' },
  { key: 'nombre', label: 'Nombre Completo' },
  { key: 'fechaNacimiento', label: 'Fecha de Nacimiento' },
  { key: 'edad', label: 'Edad' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Correo Electrónico' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'especialidad', label: 'Especialidad' },
  { key: 'cirugiaPendiente', label: 'Cirugía Pendiente' },
  { key: 'diagnostico', label: 'Diagnóstico' },
  { key: 'observaciones', label: 'Observaciones' },
  { key: 'fechaRegistro', label: 'Fecha de Registro', formato: formatFecha },
];

export default function ModalDetalle({ paciente, onClose }) {
  if (!paciente) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Detalle del Paciente</h2>
            <p className="text-xs text-gray-400 mt-0.5">Cédula: {paciente.cedula}</p>
          </div>
          <button
            id="btn-cerrar-detalle"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <dl className="space-y-3">
            {CAMPOS.map(({ key, label, formato }) => {
              const valor = paciente[key];
              const texto = formato ? formato(valor) : (valor || '—');
              return (
                <div key={key} className="flex gap-3">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-40 shrink-0 pt-0.5">
                    {label}
                  </dt>
                  <dd className="text-sm text-gray-900 flex-1 break-words">
                    {key === 'cirugiaPendiente' ? (
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                        valor === 'Sí' ? 'bg-red-50 text-red-700' :
                        valor === 'En evaluación' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {texto}
                      </span>
                    ) : texto}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
