export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-[#050b1a] border-t-[12px] border-orange-500 rounded-3xl p-10 shadow-[0_0_60px_rgba(0,127,255,0.4)] text-center space-y-8 relative overflow-hidden border-x-2 border-b-2 border-blue-600/20">

        {/* Decoración de fondo Eléctrica */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600 opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-600 opacity-20 blur-[100px]"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 rounded-full mb-8 shadow-[0_0_30px_rgba(250,204,21,0.8)] border-4 border-black">
            <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-yellow-400 mb-8 drop-shadow-[0_4px_0_rgba(0,0,0,1)] tracking-tighter uppercase">
            PRUEBAS BETA EXITOSAS
          </h1>

          <div className="flex justify-center gap-4 mb-10">
            <div className="h-3 w-20 bg-blue-500 rounded-none"></div>
            <div className="h-3 w-20 bg-yellow-400 rounded-none"></div>
            <div className="h-3 w-20 bg-orange-500 rounded-none"></div>
          </div>

          <div className="bg-black border-4 border-blue-500 rounded-2xl p-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <p className="text-2xl md:text-3xl text-white font-black leading-tight uppercase italic">
              <span className="text-yellow-400 block mb-4 text-4xl not-italic">¡Gracias por visitarnos!</span>
              <span className="text-blue-400">Gracias por accesar a esta web App, la misma estará </span>
              <span className="bg-orange-500 text-black px-2 mx-1">activa en la siguiente campaña</span>
              <span className="text-blue-400">, donde sean necesarios tus datos.</span>
            </p>
          </div>
        </div>

        {/* Barra inferior sólida de alto contraste */}
        <div className="absolute bottom-0 left-0 w-full flex h-3">
          <div className="flex-1 bg-yellow-400"></div>
          <div className="flex-1 bg-blue-600"></div>
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-black"></div>
        </div>
      </div>
    </div>  );
}
