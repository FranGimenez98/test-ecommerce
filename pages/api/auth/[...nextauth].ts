import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {connect} from "@/lib/db";
import User from "@/models/User";
import { IUser } from "@/interfaces/IUser";
import bcryptjs from "bcryptjs";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
    updateAge: 60 * 5, // 5 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          user: {
            id: user.id,
            isAdmin: user.isAdmin,
          },
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user) {
        try {
          await connect();
          const user: IUser | null = (await User.findOne({
            _id: token.user.id,
          }).lean()) as IUser;
          if (user) {
            return {
              ...session,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
              },
            };
          }
        } catch (error) {
          console.error(error);
        }
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        try {
          await connect();
          const user: IUser | null = (await User.findOne({
            email: credentials.email,
          }).lean()) as IUser;
          if (!user) throw new Error("User not found");

          if (!bcryptjs.compareSync(credentials.password, user.password)) {
            throw new Error("Password mismatch");
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: (user as IUser).isAdmin,
          };
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
});
