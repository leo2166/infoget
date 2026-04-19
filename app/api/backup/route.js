import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Verifica sesión activa
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  return null;
}

/** GET /api/backup - Obtener toda la data para respaldo (exportación) */
export async function GET(request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const data = await prisma.paciente.findMany();
    
    // Generar respuesta JSON (El nombre lo define el Front-End normalmente con un elemento 'a', pero pasamos headers sugeridos)
    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  } catch (error) {
    console.error('[API /backup GET] Error:', error);
    return NextResponse.json({ error: 'Error al generar el respaldo.' }, { status: 500 });
  }
}

/** POST /api/backup - Insertar data provista para restauración (importación) */
export async function POST(request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const data = await request.json();
    
    if (!Array.isArray(data)) {
        return NextResponse.json({ error: 'El archivo de respaldo tiene un formato inválido. Debe contener una lista de registros.' }, { status: 400 });
    }

    if (data.length === 0) {
        return NextResponse.json({ error: 'El archivo de respaldo está vacío.' }, { status: 400 });
    }

    // Formatear los registros para asegurar compatibilidad de fechas
    const insertData = data.map(item => ({
        id: item.id,
        cedula: item.cedula,
        nombre: item.nombre,
        fechaNacimiento: item.fechaNacimiento,
        edad: item.edad,
        telefono: item.telefono,
        email: item.email,
        direccion: item.direccion,
        especialidad: item.especialidad,
        cirugiaPendiente: item.cirugiaPendiente,
        diagnostico: item.diagnostico,
        observaciones: item.observaciones,
        fechaRegistro: item.fechaRegistro ? new Date(item.fechaRegistro) : new Date(),
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    }));

    // Inserción en lote (Ignoramos duplicados si por error suben un archivo con duplicados de la misma DB)
    const result = await prisma.paciente.createMany({
        data: insertData,
        skipDuplicates: true
    });

    return NextResponse.json({ message: `Restauración exitosa. ${result.count} registros insertados.` }, { status: 200 });

  } catch (error) {
    console.error('[API /backup POST] Error:', error);
    return NextResponse.json({ error: 'Error al restaurar los datos. Verifique que el archivo fue generado por INFOGET y esté intacto.' }, { status: 500 });
  }
}
