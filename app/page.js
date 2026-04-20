export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-black border-4 border-green-500 rounded-none p-12 shadow-[0_0_40px_rgba(34,197,94,0.3)] text-center space-y-10 relative overflow-hidden">

        {/* Decoración de líneas tecnológicas */}
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-green-500"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white border-4 border-green-500 rounded-full mb-8 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6">
            PRUEBAS <span className="text-green-500">BETA</span> EXITOSAS
          </h1>

          <div className="w-24 h-2 bg-green-500 mx-auto mb-10"></div>

          <div className="space-y-6">
            <p className="text-2xl md:text-3xl text-white font-light leading-snug">
              Gracias por accesar a esta web App, la misma estará 
              <span className="block text-green-500 font-black text-3xl md:text-4xl mt-4 border-2 border-green-500 py-3 px-6 uppercase tracking-widest">
                ACTIVA EN LA SIGUIENTE CAMPAÑA
              </span>
            </p>

            <p className="text-xl text-gray-400 font-medium">
              Donde sean necesarios tus datos.
            </p>
          </div>
        </div>

        {/* Footer minimalista */}
        <div className="pt-8 flex justify-center gap-4">
          <div className="w-3 h-3 bg-green-500"></div>
          <div className="w-3 h-3 bg-white"></div>
          <div className="w-3 h-3 bg-green-500"></div>
        </div>
      </div>
    </div>  );
}
