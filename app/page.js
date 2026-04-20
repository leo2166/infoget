export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-[#0a192f] border-t-4 border-orange-500 rounded-2xl p-10 shadow-2xl shadow-blue-900/50 text-center space-y-8 relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-600 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-orange-600 opacity-10 blur-3xl"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-6 shadow-lg shadow-yellow-400/30">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-6 drop-shadow-sm">
            Las pruebas beta fueron exitosas
          </h1>
          
          <div className="h-1 w-32 bg-blue-500 mx-auto rounded-full mb-8"></div>
          
          <div className="bg-black/40 border border-blue-800/50 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-xl md:text-2xl text-blue-100 font-medium leading-relaxed">
              <span className="text-orange-500 font-bold text-2xl mr-2">&gt;&gt;</span> 
              Gracias por accesar a esta web App, la misma estará activa en la siguiente campaña, donde sean necesarios tus datos 
              <span className="text-orange-500 font-bold text-2xl ml-2">&lt;&lt;</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
