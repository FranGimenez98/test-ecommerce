import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/lib/db";
import User from "@/models/User";
import { IUser } from "@/interfaces/IUser";
import bcryptjs from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
    updateAge: 60 * 5, // 5 minutes
  },
  callbacks: {
    async signIn({ account, profile, email }) {
      if (account?.provider === "google") {
        console.log("account", account);
        console.log("profile", profile);

        try {
          await connect();
          const existingUser = await User.findOne({ email: profile?.email });
          if (!existingUser) {
            const newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              email: profile?.email,
              isAdmin: false,
              password: profile?.at_hash,
              lastname: profile?.family_name,
              name: profile?.given_name,
            });
            console.log(newUser);
            await newUser.save();
          }
        } catch (error) {
          console.error("error", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      console.log("token", token)
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
            email: token?.user?.email,
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
          console.error("session", error);
        }
      }

      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
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
