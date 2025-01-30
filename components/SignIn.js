"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Globe, X } from "lucide-react"; // Lucide icons for Google alternative & close button

export default function SignIn() {
  const [showModal, setShowModal] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const signInWithGoogle = () => {
    if (!accepted) {
      setShowModal(true);
      return;
    }
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Zacvy Branding */}
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Welcome to Zacvy</h1>
      <p className="text-gray-500 mb-6">Secure & seamless authentication</p>
      
      {/* Sign-In Button */}
      <button
        onClick={signInWithGoogle}
        className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out 
          ${accepted ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
        disabled={!accepted}
      >
        <Globe className="w-6 h-6" />
        <span>Sign in with Google</span>
      </button>

      {/* Terms & Conditions Link */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        Terms & Conditions
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold">Zacvy Terms & Conditions</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-600 hover:text-black" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              By signing in, you agree to Zacvy's Terms & Conditions. Your data will be used according to our Privacy Policy.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setAccepted(true);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
