import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Calendar,
  Package,
} from "lucide-react";

type Product = {
  Id: number;
  Name: string;
  Category: string;
  Stock: number;
  ExpirationDate: string;
};

export function ExpirationAlerts() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const userId =
    localStorage.getItem("userId");

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/products/${userId}`
    )
      .then((res) => res.json())
      .then((data) =>
        setProducts(data)
      )
      .catch(console.error);
  }, []);

  const getDaysRemaining = (
    date: string
  ) => {
    const today = new Date();

    const exp = new Date(date);

    return Math.ceil(
      (exp.getTime() -
        today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const alerts = products.filter(
    (product) => {
      const days =
        getDaysRemaining(
          product.ExpirationDate
        );

      return days <= 7;
    }
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Alertas de Caducidad
          </h1>

          <p className="text-zinc-400 mt-2">
            Productos próximos a vencer
          </p>
        </div>

        <div
          className="
            bg-red-500/10 border border-red-500/20
            px-5 py-3 rounded-2xl
          "
        >
          <p className="text-sm text-zinc-400">
            Alertas activas
          </p>

          <h2 className="text-2xl font-bold text-red-400">
            {alerts.length}
          </h2>
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {alerts.map((product) => {

            const days =
              getDaysRemaining(
                product.ExpirationDate
              );

            return (
              <div
                key={product.Id}
                className={`
                  rounded-3xl p-6 border
                  shadow-2xl

                  ${
                    days <= 3
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-yellow-500/10 border-yellow-500/20"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        h-14 w-14 rounded-2xl
                        flex items-center justify-center

                        ${
                          days <= 3
                            ? "bg-red-500/20"
                            : "bg-yellow-500/20"
                        }
                      `}
                    >
                      <AlertTriangle
                        className={`
                          h-7 w-7

                          ${
                            days <= 3
                              ? "text-red-400"
                              : "text-yellow-400"
                          }
                        `}
                      />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {product.Name}
                      </h2>

                      <p className="text-zinc-400 mt-1">
                        {
                          product.Category
                        }
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      px-4 py-2 rounded-2xl
                      text-sm font-bold

                      ${
                        days <= 3
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-black"
                      }
                    `}
                  >
                    {days <= 0
                      ? "Vencido"
                      : `${days} días`}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div
                    className="
                      bg-zinc-950/40
                      rounded-2xl p-4
                    "
                  >
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Package className="h-4 w-4" />

                      Stock
                    </div>

                    <h3 className="text-2xl font-bold text-white mt-2">
                      {product.Stock}
                    </h3>
                  </div>

                  <div
                    className="
                      bg-zinc-950/40
                      rounded-2xl p-4
                    "
                  >
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Calendar className="h-4 w-4" />

                      Caducidad
                    </div>

                    <h3 className="text-lg font-bold text-white mt-2">
                      {new Date(
                        product.ExpirationDate
                      ).toLocaleDateString()}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="
            bg-zinc-900 border border-zinc-800
            rounded-3xl p-16 text-center
          "
        >
          <AlertTriangle className="h-20 w-20 text-zinc-700 mx-auto mb-6" />

          <h2 className="text-3xl font-bold text-white">
            No hay alertas activas
          </h2>

          <p className="text-zinc-400 mt-4">
            Todos los productos están en buen estado
          </p>
        </div>
      )}
    </div>
  );
}