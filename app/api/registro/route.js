import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validación server-side
    const { cedula, nombre, fechaNacimiento, edad, telefono, email, direccion, especialidad, cirugiaPendiente, diagnostico, observaciones } = body;

    if (!cedula || !/^\d{6,12}$/.test(cedula)) {
      return NextResponse.json(
        { error: 'Cédula inválida. Debe contener entre 6 y 12 dígitos.' },
        { status: 400 }
      );
    }

    if (!nombre || nombre.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio (mínimo 2 caracteres).' },
        { status: 400 }
      );
    }

    if (!fechaNacimiento) {
      return NextResponse.json(
        { error: 'La fecha de nacimiento es obligatoria.' },
        { status: 400 }
      );
    }

    if (!telefono || !/^\d{7,15}$/.test(telefono.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'El teléfono es inválido.' },
        { status: 400 }
      );
    }

    if (!especialidad || especialidad.trim().length < 2) {
      return NextResponse.json(
        { error: 'La especialidad es obligatoria.' },
        { status: 400 }
      );
    }

    if (!cirugiaPendiente) {
      return NextResponse.json(
        { error: 'El campo de cirugía pendiente es obligatorio.' },
        { status: 400 }
      );
    }

    // Verificar unicidad de la cédula antes de guardar
    const pacienteExistente = await prisma.paciente.findUnique({
      where: { cedula: cedula.trim() }
    });

    if (pacienteExistente) {
      return NextResponse.json(
        { error: 'Ya existe un registro con la cédula proporcionada' },
        { status: 409 }
      );
    }

    // Guardar en la base de datos
    await prisma.paciente.create({
      data: {
        cedula: cedula.trim(),
        nombre: nombre.trim(),
        fechaNacimiento,
        edad: edad?.toString() || '',
        telefono: telefono.trim(),
        email: email?.trim() || '',
        direccion: direccion?.trim() || '',
        especialidad: especialidad.trim(),
        cirugiaPendiente,
        diagnostico: diagnostico?.trim() || '',
        observaciones: observaciones?.trim() || '',
      }
    });

    return NextResponse.json(
      { message: 'Registro guardado exitosamente.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /registro] Error:', error);

    // Errores de unicidad de base de datos desde Prisma (si por alguna razón se escapó la validación superior)
    if (error.code === 'P2002') {
       return NextResponse.json({ error: 'Ya existe un registro con la cédula proporcionada' }, { status: 409 });
    }

    return NextResponse.json(
      { error: 'Error interno del servidor. Intente nuevamente.' },
      { status: 500 }
    );
  }
}
