import { NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/client';
import { ContactProfileProps } from '@/types/profile';
import { contactFormSchema } from '@/lib/validation/contactFormSchema';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: ContactProfileProps = await req.json();

    // Validation with safeParse
    const validation = contactFormSchema.safeParse(body);
    if (!validation.success) {
      NextResponse.json(validation.error.format(), { status: 400 });
    }

    const updateProfile = await prisma.user.update({
      where: { id: params.id },
      data: {
        street: body.street,
        city: body.city,
        phone: body.phone
      }
    });

    return NextResponse.json(
      {
        message: `Profile id:${params.id} is updated`
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error
      },
      { status: 500 }
    );
  }
}
