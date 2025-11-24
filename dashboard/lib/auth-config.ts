import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Get user from Firestore
          const usersRef = db.collection('users');
          const snapshot = await usersRef.where('email', '==', credentials.email).limit(1).get();
          
          if (snapshot.empty) {
            return null;
          }

          const userDoc = snapshot.docs[0];
          const userData = userDoc.data();

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, userData.password_hash);
          
          if (!isValid) {
            return null;
          }

          // Return user object
          return {
            id: userDoc.id,
            email: userData.email,
            name: userData.name,
            whatsapp: userData.whatsapp,
            role: userData.role || 'client',
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.whatsapp = (user as any).whatsapp;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).whatsapp = token.whatsapp;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

