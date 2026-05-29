import { useEffect, useState } from "react";

import {
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

type Product = {
  Stock: number;
};

type Sale = {
  Total: number;
  Date: string;
};

export function Dashboard() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [sales, setSales] =
    useState<Sale[]>([]);

  const userId =
    localStorage.getItem("userId");

  const store =
    localStorage.getItem("store");

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/products/${userId}`
    )
      .then((res) => res.json())
      .then((data) =>
        setProducts(data)
      );

    fetch(
      `${import.meta.env.VITE_API_URL}/sales/${userId}`
    )
      .then((res) => res.json())
      .then((data) =>
        setSales(data)
      );
  }, []);

  const totalProducts =
    products.reduce(
      (sum, p) =>
        sum +
        Number(p.Stock || 0),
      0
    );

  const totalAmount =
    sales.reduce(
      (sum, s) =>
        sum +
        Number(s.Total || 0),
      0
    );

  const today =
    new Date().toDateString();

  const todaySales =
    sales.filter(
      (sale) =>
        new Date(
          sale.Date
        ).toDateString() === today
    );

  const dailySalesTotal =
    todaySales.reduce(
      (sum, s) =>
        sum +
        Number(s.Total || 0),
      0
    );

  const cards = [
    {
      title: "Productos",
      value: totalProducts,
      icon: Package,
    },
    {
      title: "Ventas",
      value: sales.length,
      icon: ShoppingCart,
    },
    {
      title: "Ingresos",
      value: `$${totalAmount.toFixed(
        2
      )}`,
      icon: DollarSign,
    },
    {
      title: "Ventas Hoy",
      value: `$${dailySalesTotal.toFixed(
        2
      )}`,
      icon: AlertTriangle,
    },
  ];

  const salesChart =
    sales.map((sale, index) => ({
      name: `Venta ${index + 1}`,
      total: Number(sale.Total),
    }));

  const stockChart = [
    {
      category: "Inventario",
      stock: totalProducts,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Dashboard
            </h1>

            <p className="text-zinc-400 mt-2">
              Resumen general del sistema
            </p>
          </div>

          <div
            className="
              bg-emerald-500/10
              border border-emerald-500/20
              px-5 py-3 rounded-2xl
            "
          >
            <p className="text-zinc-400 text-sm">
              Tienda activa
            </p>

            <h2 className="text-emerald-400 font-bold text-xl">
              {store}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-zinc-900 border border-zinc-800
                rounded-3xl p-6
                shadow-xl
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-bold text-white mt-3">
                    {card.value}
                  </h2>
                </div>

                <div
                  className="
                    h-14 w-14 rounded-2xl
                    bg-emerald-500/10
                    flex items-center justify-center
                  "
                >
                  <Icon className="h-7 w-7 text-emerald-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          className="
            bg-zinc-900 border border-zinc-800
            rounded-3xl p-6 h-[400px]
          "
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Tendencia de Ventas
          </h2>

          <ResponsiveContainer
            width="100%"
            height="85%"
          >
            <LineChart
              data={salesChart}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className="
            bg-zinc-900 border border-zinc-800
            rounded-3xl p-6 h-[400px]
          "
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Stock General
          </h2>

          <ResponsiveContainer
            width="100%"
            height="85%"
          >
            <BarChart
              data={stockChart}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
              />

              <XAxis dataKey="category" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="stock"
                fill="#10b981"
                radius={[
                  12, 12, 0, 0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}