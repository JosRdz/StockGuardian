import { useEffect, useState } from "react";

import {
  Receipt,
  Calendar,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

type Sale = {
  Id: number;
  ProductName: string;
  Quantity: number;
  Total: number;
  Date: string;
};

export function SalesHistory() {
  const [sales, setSales] =
    useState<Sale[]>([]);

  const userId =
    localStorage.getItem("userId");

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/sales/${userId}`
    )
      .then((res) => res.json())
      .then((data) =>
        setSales(data)
      )
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Historial de Ventas
          </h1>

          <p className="text-zinc-400 mt-2">
            Registro completo de ventas
          </p>
        </div>

        <div
          className="
            bg-zinc-900 border border-zinc-800
            px-5 py-3 rounded-2xl
          "
        >
          <p className="text-sm text-zinc-400">
            Total ventas
          </p>

          <h2 className="text-2xl font-bold text-emerald-400">
            {sales.length}
          </h2>
        </div>
      </div>

      <div
        className="
          overflow-hidden
          rounded-3xl
          border border-zinc-800
          bg-zinc-900
          shadow-2xl
        "
      >
        <table className="w-full">
          <thead className="bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th className="text-left px-6 py-5 text-zinc-400">
                ID
              </th>

              <th className="text-left px-6 py-5 text-zinc-400">
                Producto
              </th>

              <th className="text-left px-6 py-5 text-zinc-400">
                Cantidad
              </th>

              <th className="text-left px-6 py-5 text-zinc-400">
                Total
              </th>

              <th className="text-left px-6 py-5 text-zinc-400">
                Fecha
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.length > 0 ? (
              sales.map(
                (sale, index) => (
                  <tr
                    key={sale.Id}
                    className="
                      border-b border-zinc-800
                      hover:bg-zinc-800/50
                      transition-all duration-300
                    "
                  >
                    <td className="px-6 py-5 text-white font-semibold">
                      #{sale.Id}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                            h-12 w-12 rounded-2xl
                            bg-emerald-500/10
                            flex items-center justify-center
                          "
                        >
                          <Receipt className="h-6 w-6 text-emerald-400" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-white">
                            {
                              sale.ProductName
                            }
                          </h3>

                          <p className="text-zinc-500 text-sm">
                            Venta registrada
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-zinc-500" />

                        {
                          sale.Quantity
                        }
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <DollarSign className="h-4 w-4" />

                        {Number(
                          sale.Total
                        ).toFixed(2)}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-500" />

                        {new Date(
                          sale.Date
                        ).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center"
                >
                  <Receipt className="h-16 w-16 text-zinc-700 mx-auto mb-6" />

                  <h3 className="text-2xl font-semibold text-white">
                    No hay ventas registradas
                  </h3>

                  <p className="text-zinc-400 mt-3">
                    Las ventas aparecerán aquí
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}