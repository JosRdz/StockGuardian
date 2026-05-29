import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Package,
  Plus,
} from "lucide-react";

import { motion } from "framer-motion";

import { AddProductDialog } from "./AddProductDialog";

import { RestockDialog } from "./RestockDialog";

type Product = {
  Id: number;
  Name: string;
  Category: string;
  Price: number;
  Stock: number;
  ExpirationDate: string;
};

export function Inventory() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] =
    useState("");

  const [openAdd, setOpenAdd] =
    useState(false);

  const [openRestock, setOpenRestock] =
    useState(false);

  const [refresh, setRefresh] =
    useState(false);

  const userId =
    localStorage.getItem("userId");

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/products/${userId}`
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setProducts(data)
      )
      .catch(console.error);

  }, [refresh]);

  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (product) =>
          product.Name.toLowerCase().includes(
            search.toLowerCase()
          )
      );

    }, [products, search]);

  const getProductStatus = (
    date: string
  ) => {

    if (!date)
      return "good";

    const today =
      new Date();

    const exp =
      new Date(date);

    const days =
      Math.ceil(
        (
          exp.getTime() -
          today.getTime()
        ) /
        (
          1000 *
          60 *
          60 *
          24
        )
      );

    if (days <= 3)
      return "critical";

    if (days <= 7)
      return "warning";

    return "good";
  };

  const renderStatus = (
    status: string
  ) => {

    switch (status) {

      case "critical":

        return (
          <span
            className="
              bg-red-500/20 text-red-400
              px-3 py-1 rounded-full
              text-xs font-medium
            "
          >
            Crítico
          </span>
        );

      case "warning":

        return (
          <span
            className="
              bg-yellow-500/20 text-yellow-400
              px-3 py-1 rounded-full
              text-xs font-medium
            "
          >
            Advertencia
          </span>
        );

      default:

        return (
          <span
            className="
              bg-emerald-500/20 text-emerald-400
              px-3 py-1 rounded-full
              text-xs font-medium
            "
          >
            Correcto
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Inventario
          </h1>

          <p className="text-zinc-400 mt-2">
            Administración completa
            de productos y stock
          </p>

        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setOpenRestock(true)
            }
            className="
              bg-zinc-800 hover:bg-zinc-700
              text-white font-semibold
              px-6 py-3 rounded-2xl
            "
          >
            Reabastecer
          </button>

          <button
            onClick={() =>
              setOpenAdd(true)
            }
            className="
              bg-emerald-500 hover:bg-emerald-400
              text-black font-semibold
              px-6 py-3 rounded-2xl
              flex items-center gap-2
            "
          >
            <Plus className="h-5 w-5" />

            Nuevo Producto
          </button>

        </div>

      </div>

      <div className="relative">

        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />

        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full bg-zinc-900 border border-zinc-800
            rounded-2xl pl-14 pr-5 py-4
            text-white placeholder-zinc-500
            focus:outline-none focus:ring-2
            focus:ring-emerald-500
          "
        />

      </div>

      <div
        className="
          overflow-hidden rounded-3xl
          border border-zinc-800
          bg-zinc-900 shadow-2xl
        "
      >

        <table className="w-full">

          <thead className="bg-zinc-950 border-b border-zinc-800">

            <tr>

              <th className="text-left px-6 py-5 text-zinc-400">
                Producto
              </th>

              <th className="text-left px-6 py-5 text-zinc-400">
                Categoría
              </th>

              <th className="text-left px-6 py-5 text-zinc-400">
                Stock
              </th>

              <th className="text-left px-6 py-5 text-zinc-400">
                Precio
              </th>

              <th className="text-left px-6 py-5 text-zinc-400">
                Estado
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredProducts.map(
              (
                product,
                index
              ) => {

                const status =
                  getProductStatus(
                    product.ExpirationDate
                  );

                return (

                  <motion.tr
                    key={product.Id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.03,
                    }}
                    className="
                      border-b border-zinc-800
                      hover:bg-zinc-800/50
                    "
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div
                          className="
                            h-12 w-12 rounded-2xl
                            bg-emerald-500/10
                            flex items-center justify-center
                          "
                        >
                          <Package className="h-6 w-6 text-emerald-400" />
                        </div>

                        <div>

                          <h3 className="font-semibold text-white">
                            {product.Name}
                          </h3>

                          <p className="text-sm text-zinc-500">
                            ID #
                            {product.Id}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5 text-zinc-300">
                      {product.Category}
                    </td>

                    <td className="px-6 py-5 text-zinc-300">
                      {product.Stock}
                    </td>

                    <td className="px-6 py-5 text-zinc-300">
                      $
                      {product.Price}
                    </td>

                    <td className="px-6 py-5">
                      {renderStatus(
                        status
                      )}
                    </td>

                  </motion.tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

      <AddProductDialog
        open={openAdd}
        onOpenChange={
          setOpenAdd
        }
        mode="add"
      />

      <RestockDialog
        open={openRestock}
        onOpenChange={
          setOpenRestock
        }
        onSuccess={() =>
          setRefresh(
            (prev) => !prev
          )
        }
      />

    </div>
  );
}