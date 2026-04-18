import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const claveAdmin = process.env.ADMIN_PASSWORD;
        if (credentials?.password === claveAdmin) {
          return { id: '1', name: 'Administrador', email: 'admin@infoget.local' };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
