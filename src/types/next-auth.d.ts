import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    username: string;
    email: string;
    role: string;
    id: string;
    provider: string;
    street: string?;
    city: string?;
    phone: string?;
  }
  interface Session {
    user: User & {
      username: string;
      email: string;
      role: string;
      id: string;
      provider: string;
      street: string?;
      city: string?;
      phone: string?;
    };
    token: {
      username: string;
      email: string;
      role: string;
      id: string;
      provider: string;
      street: string?;
      city: string?;
      phone: string?;
    };
  }
}
