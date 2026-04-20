export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-[#050b1a] border-t-8 border-orange-500 rounded-3xl p-10 shadow-[0_0_50px_rgba(30,58,138,0.5)] text-center space-y-8 relative overflow-hidden border-x border-b border-blue-900/30">

        {/* Decoración de fondo ultra-vibrante */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500 opacity-20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-500 opacity-20 blur-[100px] animate-pulse"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 rounded-full mb-8 shadow-[0_0_30px_rgba(250,204,21,0.6)] border-4 border-black">
            <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-400 to-yellow-500 mb-8 drop-shadow-[0_2px_10px_rgba(250,204,21,0.4)] tracking-tight">
            PRUEBAS BETA EXITOSAS
          </h1>

          <div className="flex justify-center gap-2 mb-10">
            <div className="h-2 w-16 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            <div className="h-2 w-16 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
            <div className="h-2 w-16 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
          </div>

          <div className="bg-gradient-to-b from-blue-900/40 to-black/60 border-2 border-blue-500/50 rounded-2xl p-8 backdrop-blur-md shadow-inner">
            <p className="text-2xl md:text-3xl text-white font-bold leading-tight">
              <span className="text-yellow-400 block mb-4 text-4xl">¡Gracias por visitarnos!</span>
              <span className="text-blue-300">Gracias por accesar a esta web App, la misma estará </span>
              <span className="text-orange-500 underline decoration-yellow-400 decoration-4 underline-offset-8">activa en la siguiente campaña</span>
              <span className="text-blue-300">, donde sean necesarios tus datos.</span>
            </p>
          </div>
        </div>

        {/* Barra inferior de contraste */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-blue-600 to-orange-500"></div>
      </div>
    </div>
  );
}
