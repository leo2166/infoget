import NavbarPublica from '@/components/NavbarPublica';
import FormularioRegistro from '@/components/FormularioRegistro';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarPublica />
      <main className="flex-1 py-8">
        <FormularioRegistro />
      </main>
    </div>
  );
}
