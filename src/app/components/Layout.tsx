import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  ShoppingCart,
  History,
  LogOut,
  ShoppingCart as CartIcon,
} from 'lucide-react';

import { motion } from 'framer-motion';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Inventario',
      href: '/inventory',
      icon: Package,
    },
    {
      name: 'Alertas',
      href: '/alerts',
      icon: AlertTriangle,
    },
    {
      name: 'Ventas',
      href: '/sales',
      icon: ShoppingCart,
    },
    {
      name: 'Historial',
      href: '/sales-history',
      icon: History,
    },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-72 border-b lg:border-r border-zinc-800 bg-zinc-900/80 backdrop-blur-xl">
        <div className="h-full flex flex-col">
          {/* LOGO */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                <CartIcon className="h-6 w-6 text-black" />
              </div>

              <div>
                <h2 className="font-bold text-lg tracking-tight">
                  GroceryPro
                </h2>

                <p className="text-sm text-zinc-400">
                  Inventory System
                </p>
              </div>
            </div>
          </div>

          {/* USER */}
          <div className="px-6 py-5 border-b border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black">
                A
              </div>

              <div>
                <h3 className="font-semibold">Administrador</h3>

                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-xs text-zinc-400">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className={`
                      flex items-center gap-4 px-4 py-4 rounded-2xl
                      transition-all duration-300 group
                      ${
                        isActive
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        h-5 w-5 transition-transform duration-300
                        group-hover:scale-110
                      `}
                    />

                    <span className="font-medium tracking-tight">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* LOGOUT */}
          <div className="p-4 border-t border-zinc-800">
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-3
                px-4 py-4 rounded-2xl
                bg-zinc-800 hover:bg-red-500
                transition-all duration-300
                text-zinc-300 hover:text-white
              "
            >
              <LogOut className="h-5 w-5" />

              <span className="font-medium">
                Cerrar sesión
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 overflow-auto">
        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}