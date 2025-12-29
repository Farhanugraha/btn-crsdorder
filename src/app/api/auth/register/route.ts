import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // LOG supaya tahu request masuk
    console.log('REGISTER PAYLOAD:', body);

    // SIMULASI DELAY (optional, biar terasa real)
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        user: {
          id: 1,
          username: body.username ?? 'dummy',
          email: body.email ?? 'dummy@mail.com'
        },
        message: 'User created (mock)'
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Mock register error'
      },
      { status: 500 }
    );
  }
}
