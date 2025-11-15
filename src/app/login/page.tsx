// src/app/login/page.tsx

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5D7]">
      {/* Header con logo */}
      <header className="py-6 text-center">
        <h1 className="text-3xl font-bold text-[#0A2A45]">WashApp</h1>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-center text-[#0A2A45] mb-6">
            Iniciar sesión
          </h2>

          <form className="space-y-4">
            <Input type="email" placeholder="Correo electrónico" required />
            <Input type="password" placeholder="Contraseña" required />

            <Button className="w-full rounded-full bg-[#0A2A45] text-white py-2">
              Iniciar sesión
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿No tienes cuenta? {" "}
            <a href="/registrarse" className="text-[#0A2A45] font-semibold hover:underline">
              Registrarse
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
