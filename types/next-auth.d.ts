import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    expires: string;
    user: {
      email: string;
      id: string;
      isAdmin: boolean;
      name: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    isAdmin: boolean;
  }
  interface AdapterUser extends User {
    isAdmin: boolean;
  }

  interface Profile {
    at_hash: string;
    family_name: string;
    given_name: string;
  }
}
