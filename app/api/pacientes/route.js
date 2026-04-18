import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/** Middleware helper: verifica sesión activa */
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  return null;
}

/** GET /api/pacientes — Listar todos los registros */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const data = await prisma.paciente.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Devolvemos el array 'data' mapeado o directo. 
    return NextResponse.json({ pacientes: data }, { status: 200 });
  } catch (error) {
    console.error('[API /pacientes GET] Error:', error);
    return NextResponse.json(
      { error: 'Error al leer los registros.' },
      { status: 500 }
    );
  }
}

/** PUT /api/pacientes — Actualizar un registro existente */
export async function PUT(request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { cedulaOriginal, ...data } = body;

    if (!cedulaOriginal) {
      return NextResponse.json(
        { error: 'Se requiere la cédula original para actualizar.' },
        { status: 400 }
      );
    }
    
    // Normalizar datos de entrada (quitar espacios en campos unicos)
    if (data.cedula) {
      data.cedula = data.cedula.trim();
    }
    if (data.nombre) {
      data.nombre = data.nombre.trim();
    }

    await prisma.paciente.update({
      where: { cedula: cedulaOriginal.trim() },
      data: data
    });
    
    return NextResponse.json({ message: 'Registro actualizado.' }, { status: 200 });
  } catch (error) {
    // P2002 es error de unicidad en Prisma
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe un paciente con esa cédula nueva.' }, { status: 409 });
    }
    
    // P2025 es registro no encontrado
    if (error.code === 'P2025') {
       return NextResponse.json({ error: 'Registro no encontrado.' }, { status: 404 });
    }
    
    console.error('[API /pacientes PUT] Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el registro.' },
      { status: 500 }
    );
  }
}

/** DELETE /api/pacientes?cedula=... — Eliminar un registro */
export async function DELETE(request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const cedula = searchParams.get('cedula');

    if (!cedula) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro "cedula".' },
        { status: 400 }
      );
    }

    await prisma.paciente.delete({
      where: { cedula: cedula.trim() }
    });
    
    return NextResponse.json({ message: 'Registro eliminado.' }, { status: 200 });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Registro no encontrado.' }, { status: 404 });
    }
    console.error('[API /pacientes DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el registro.' },
      { status: 500 }
    );
  }
}

/** POST /api/pacientes?action=deleteAll — Vaciar base de datos */
export async function POST(request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'deleteAll') {
      await prisma.paciente.deleteMany({});
      return NextResponse.json({ message: 'Base de datos vaciada con éxito.' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Acción no válida.' }, { status: 400 });
  } catch (error) {
    console.error('[API /pacientes POST] Error:', error);
    return NextResponse.json({ error: 'Error al vaciar la base de datos.' }, { status: 500 });
  }
}
