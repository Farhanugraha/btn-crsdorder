import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '../../prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import { loginFormSchema } from './validation/loginFormSchema';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/'
  },
  providers: [
    GoogleProvider({
      id: 'google',
      name: 'Google',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'Username'
        },
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const parsedCredentials =
          loginFormSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          if (!email || !password) {
            return null;
          }

          const existUserByEmail = await prisma.user.findUnique({
            where: {
              email: email
            }
          });

          if (!existUserByEmail) {
            return null;
          }

          const passwordMatch = await compare(
            password,
            existUserByEmail.password!
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: existUserByEmail.id,
            username: existUserByEmail.username,
            email: existUserByEmail.email,
            street: existUserByEmail.street,
            city: existUserByEmail.city,
            phone: existUserByEmail.phone,
            role: existUserByEmail.role,
            provider: existUserByEmail.provider
          };
        } else return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        token.username = session.user.username;
        token.email = session.user.email;
        token.street = session.user.street;
        token.city = session.user.city;
        token.phone = session.user.phone;

        return token;
      }

      if (user) {
        return {
          ...token,
          username: user.username,
          email: user.email,
          role: user.role,
          id: user.id,
          provider: user.provider,
          street: user.street,
          city: user.city,
          phone: user.phone
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          email: token.email,
          role: token.role,
          id: token.id,
          provider: token.provider,
          street: token.street,
          city: token.city,
          phone: token.phone
        }
      };
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          const existUserByEmail = await prisma.user.findUnique({
            where: {
              email: profile?.email
            }
          });

          if (!existUserByEmail) {
            const newUser = await prisma.user.create({
              data: {
                id: profile?.sub,
                username: profile?.name as string,
                email: profile?.email as string,
                street: '',
                city: '',
                phone: '',
                image: profile?.image,
                provider: 'GOOGLE'
              }
            });
          }
          return true;
        } catch (error) {
          console.log('Error is occured: ', error);
          return false;
        }
      }

      return true; // Do different verification for other providers that don't have `email_verified`
    }
  }
};
