import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  AlertTriangle,
  LogOut,
} from "lucide-react";

import { Dashboard } from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { Sales } from "./components/Sales";
import { SalesHistory } from "./components/SalesHistory";
import { ExpirationAlerts } from "./components/ExpirationAlerts";
import { Login } from "./components/Login";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId =
    localStorage.getItem("userId");

  if (!userId) {
    return <Navigate to="/" />;
  }

  return children;
}

function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* SIDEBAR */}
      <aside
        className="
          w-72 min-h-screen
          bg-zinc-900 border-r border-zinc-800
          p-6 flex flex-col
        "
      >
        {/* LOGO */}
        <div className="mb-12 flex items-center gap-4">
          <div
            className="
              h-14 w-14 rounded-2xl
              bg-emerald-500
              flex items-center justify-center
              shadow-lg shadow-emerald-500/20
            "
          >
            <Package className="h-8 w-8 text-black" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              StockGuardian
            </h1>

            <p className="text-zinc-500 text-sm mt-1">
              Inventory System
            </p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex flex-col h-full">
          <div className="space-y-3">
            <a
              href="/dashboard"
              className="
                flex items-center gap-4
                px-5 py-4 rounded-2xl
                bg-zinc-800 hover:bg-zinc-700
                transition-all duration-300
                text-white font-medium
              "
            >
              <LayoutDashboard className="h-5 w-5" />

              Dashboard
            </a>

            <a
              href="/inventory"
              className="
                flex items-center gap-4
                px-5 py-4 rounded-2xl
                bg-zinc-800 hover:bg-zinc-700
                transition-all duration-300
                text-white font-medium
              "
            >
              <Package className="h-5 w-5" />

              Inventario
            </a>

            <a
              href="/sales"
              className="
                flex items-center gap-4
                px-5 py-4 rounded-2xl
                bg-zinc-800 hover:bg-zinc-700
                transition-all duration-300
                text-white font-medium
              "
            >
              <ShoppingCart className="h-5 w-5" />

              Ventas
            </a>

            <a
              href="/history"
              className="
                flex items-center gap-4
                px-5 py-4 rounded-2xl
                bg-zinc-800 hover:bg-zinc-700
                transition-all duration-300
                text-white font-medium
              "
            >
              <History className="h-5 w-5" />

              Historial
            </a>

            <a
              href="/alerts"
              className="
                flex items-center gap-4
                px-5 py-4 rounded-2xl
                bg-zinc-800 hover:bg-zinc-700
                transition-all duration-300
                text-white font-medium
              "
            >
              <AlertTriangle className="h-5 w-5" />

              Alertas
            </a>
          </div>

          {/* LOGOUT */}
          <div className="mt-auto pt-8">
            <button
              onClick={() => {
                localStorage.clear();

                window.location.href =
                  "/";
              }}
              className="
                w-full
                flex items-center gap-4
                px-5 py-4 rounded-2xl
                bg-red-500/10 hover:bg-red-500
                text-red-400 hover:text-white
                transition-all duration-300
                font-medium
              "
            >
              <LogOut className="h-5 w-5" />

              Cerrar Sesión
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Layout>
                <Sales />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <SalesHistory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpirationAlerts />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}