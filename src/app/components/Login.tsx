import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Package,
  User,
  Lock,
} from "lucide-react";

export function Login() {

  const navigate =
    useNavigate();

  const [isRegister, setIsRegister] =
    useState(false);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const endpoint =
        isRegister
          ? "register"
          : "login";

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/${endpoint}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          data
        );

        return;
      }

      localStorage.setItem(
        "userId",
        data.userId
      );

      localStorage.setItem(
        "username",
        data.username
      );

      navigate("/dashboard");

    } catch (err) {

      console.error(err);

      alert(
        "Error del servidor"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-zinc-950
        flex items-center justify-center
        p-6
      "
    >

      <div
        className="
          w-full max-w-md
          bg-zinc-900 border border-zinc-800
          rounded-3xl p-8
          shadow-2xl
        "
      >

        <div className="flex flex-col items-center mb-8">

          <div
            className="
              h-20 w-20 rounded-3xl
              bg-emerald-500
              flex items-center justify-center
            "
          >
            <Package className="h-10 w-10 text-black" />
          </div>

          <h1
            className="
              text-4xl font-bold text-white
              mt-6 tracking-tight
            "
          >
            StockGuardian
          </h1>

          <p className="text-zinc-500 mt-2">
            Inventory System
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label
              className="
                text-sm text-zinc-400
                mb-2 block
              "
            >
              Usuario
            </label>

            <div className="relative">

              <User
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  h-5 w-5 text-zinc-500
                "
              />

              <input
                type="text"
                placeholder="usuario"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                className="
                  w-full bg-zinc-800 border border-zinc-700
                  rounded-2xl pl-12 pr-4 py-4
                  text-white
                "
                required
              />

            </div>

          </div>

          <div>

            <label
              className="
                text-sm text-zinc-400
                mb-2 block
              "
            >
              Contraseña
            </label>

            <div className="relative">

              <Lock
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  h-5 w-5 text-zinc-500
                "
              />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="
                  w-full bg-zinc-800 border border-zinc-700
                  rounded-2xl pl-12 pr-4 py-4
                  text-white
                "
                required
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-emerald-500
              hover:bg-emerald-400
              text-black font-bold
              py-4 rounded-2xl
            "
          >
            {
              loading
                ? "Cargando..."
                : isRegister
                ? "Crear Cuenta"
                : "Iniciar Sesión"
            }
          </button>

        </form>

        <div className="mt-6 text-center">

          <button
            onClick={() =>
              setIsRegister(
                !isRegister
              )
            }
            className="
              text-emerald-400
              hover:text-emerald-300
            "
          >
            {
              isRegister
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "Crear nueva cuenta"
            }
          </button>

        </div>

      </div>

    </div>
  );
}