import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

// interface MyComponentProps {
//   session: {
//     expires: string;
//     user: {
//       email: string;
//       id: string;
//       isAdmin: boolean;
//       name: string;
//     };
//   };
// }

export default function Navbar() {
  const { data: session, status } = useSession();
  return (
    <div className="w-full h-16 bg-white flex justify-between">
      <div className="md:w-[95vw] m-auto flex items-center justify-between">
        <div className="flex items-center justify-center">
          <Link href="/">
            <h1>Logo</h1>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          {session ? (
            <div>{session?.user?.name}</div>
          ) : (
            <ul className="flex items-center gap-5">
              <li>jdska</li>
              <li>ghjg</li>
              <li>ghj</li>
              <li>ghjg</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
