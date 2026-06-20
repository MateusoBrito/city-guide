"use client";

import { signIn } from "next-auth/react";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
    return(
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">

                <div className = "flex flex-col items-center mb-8">
                    <GraduationCap className="w-12 h-12 text-indigo-600 mb-3"/>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Bem-vindo ao City Guide
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Entre para avaliar estabelecimentos
                    </p>
                </div>

                <button onClick={() => signIn("google")}
                    className="w-full flex items-center justify-center gap-3 border rounded-lg px-4 py-3 hover:bg-slate-50 transition">
                        <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                        />
                        Entrar com Google
                    </button>

            </div>
        </div> 
    )
}