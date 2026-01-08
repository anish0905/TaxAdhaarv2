import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (user && bcrypt.compareSync(credentials!.password, user.password)) {
          // Yahan se return kiya gaya object 'jwt' callback ke 'user' argument mein jata hai
          return { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email, 
            role: user.role 
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      // Jab user pehli baar login karta hai, id aur role token mein save karein
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Token se nikaal kar session mein daalein taaki frontend/server side par use ho sake
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" as const }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };