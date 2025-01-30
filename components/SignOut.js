"use client";

import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { LogOut } from "lucide-react";

export default function SignOut() {
  return (
    <button
      onClick={() => signOut(auth)}
      className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out 
                 hover:bg-red-700 hover:shadow-lg active:scale-95"
    >
      <LogOut className="w-5 h-5" />
      Sign out
    </button>
  );
}
