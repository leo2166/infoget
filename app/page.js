export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
        
        {/* Franja Superior de Éxito */}
        <div className="bg-green-600 h-3 w-full"></div>

        <div className="p-8 sm:p-12 text-center">
          {/* Icono de Éxito Circular */}
          <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8 border-2 border-green-100">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Pruebas Beta Exitosas
          </h1>

          <div className="h-1 w-16 bg-green-500 mx-auto mb-8 rounded-full"></div>

          <div className="space-y-6">
            <p className="text-xl sm:text-2xl text-gray-600 font-medium leading-relaxed">
              Gracias por accesar a esta web App, la misma estará <span className="text-green-700 font-bold">activa en la siguiente campaña</span>, donde sean necesarios tus datos.
            </p>
          </div>

          {/* Botón Decorativo / Info */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm font-bold text-green-600 uppercase tracking-widest">
              INFOGET v1.0
            </p>
          </div>
        </div>

        {/* Decoración Inferior */}
        <div className="bg-black py-4 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-2 h-2 rounded-full bg-white opacity-20"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      {/* Mensaje de pie de página fuera de la tarjeta */}
      <p className="mt-8 text-gray-400 text-sm font-medium">
        © {new Date().getFullYear()} Plataforma de Registro Multi-uso
      </p>
    </div>  );
}
