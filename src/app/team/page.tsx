import Link from 'next/link';

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-xl font-bold tracking-tight">Triadix</Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">Equipo Triadix</h1>
            <p className="text-lg text-muted-foreground">
              Los ingenieros fundadores detrás de la plataforma.
            </p>
          </div>

          <div className="space-y-8">
            {/* Andrés */}
            <div className="flex items-start gap-6 p-6 border rounded-lg border-blue-500/20 bg-blue-500/5">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                <span className="text-xl font-bold">AS</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Andrés Felipe Sarrias Abogal</h2>
                <p className="text-blue-600 font-medium mb-2">Director de Desarrollo y Arquitectura (Core)</p>
                <p className="text-muted-foreground">
                  Encargado de construir la arquitectura escalable, el motor transaccional, inventario multisede, punto de venta y CRM de Triadix. Lidera la visión del pilar Core.
                </p>
              </div>
            </div>

            {/* Nicolás */}
            <div className="flex items-start gap-6 p-6 border rounded-lg border-green-500/20 bg-green-500/5">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 flex-shrink-0">
                <span className="text-xl font-bold">NC</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Nicolás Chávez Oliveros</h2>
                <p className="text-green-600 font-medium mb-2">Director de Ciberseguridad (Shield)</p>
                <p className="text-muted-foreground">
                  Experto en seguridad perimetral, MFA y Row Level Security (RLS). Diseñó la infraestructura de acceso Zero Trust y el registro de auditoría inmutable del pilar Shield.
                </p>
              </div>
            </div>

            {/* Luis */}
            <div className="flex items-start gap-6 p-6 border rounded-lg border-purple-500/20 bg-purple-500/5">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 flex-shrink-0">
                <span className="text-xl font-bold">LA</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Luis de Ávila Mosquera</h2>
                <p className="text-purple-600 font-medium mb-2">Director de Inteligencia Artificial (Mind)</p>
                <p className="text-muted-foreground">
                  Especialista en modelos de lenguaje y búsquedas vectoriales. Arquitecto del Mostrador Inteligente, predicción de reabastecimiento y el motor semántico de sustitutos del pilar Mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

