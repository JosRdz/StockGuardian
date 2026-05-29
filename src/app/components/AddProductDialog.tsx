import { useState } from "react";

import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
};

export function AddProductDialog({
  open,
  onOpenChange,
}: Props) {
  const [form, setForm] = useState({
    Name: "",
    Category: "",
    Price: "",
    Stock: "",
    ExpirationDate: "",
    Supplier: "",
  });

  const userId =
    localStorage.getItem("userId");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {

      await fetch(
        `${import.meta.env.VITE_API_URL}/products`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            Name: form.Name,

            Category:
              form.Category,

            Price: Number(
              form.Price
            ),

            Stock: Number(
              form.Stock
            ),

            ExpirationDate:
              form.ExpirationDate,

            Supplier:
              form.Supplier,

            userId
          }),
        }
      );

      toast.success(
        "Producto agregado"
      );

      onOpenChange(false);

      window.location.reload();

    } catch (error) {

      toast.error(
        "Error agregando producto"
      );
    }
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/60
        backdrop-blur-sm
        flex items-center justify-center
        p-6
      "
    >
      <div
        className="
          w-full max-w-2xl
          bg-zinc-900 border border-zinc-800
          rounded-3xl p-8
          shadow-2xl
        "
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Nuevo Producto
            </h2>

            <p className="text-zinc-400 mt-2">
              Agrega un nuevo producto al inventario
            </p>
          </div>

          <button
            onClick={() =>
              onOpenChange(false)
            }
            className="
              h-10 w-10 rounded-xl
              bg-zinc-800 hover:bg-zinc-700
              text-white
            "
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            type="text"
            placeholder="Nombre"
            value={form.Name}
            onChange={(e) =>
              setForm({
                ...form,
                Name: e.target.value,
              })
            }
            className="
              bg-zinc-950 border border-zinc-800
              rounded-2xl px-5 py-4
              text-white
            "
            required
          />

          <select
            value={form.Category}
            onChange={(e) =>
              setForm({
                ...form,
                Category:
                  e.target.value,
              })
            }
            className="
              bg-zinc-950 border border-zinc-800
              rounded-2xl px-5 py-4
              text-white
            "
            required
          >
            <option value="">
              Categoría
            </option>

            <option value="Lácteos">
              Lácteos
            </option>

            <option value="Bebidas">
              Bebidas
            </option>

            <option value="Carnes">
              Carnes
            </option>

            <option value="Panadería">
              Panadería
            </option>

            <option value="Snacks">
              Snacks
            </option>

            <option value="Frutas">
              Frutas
            </option>

            <option value="Verduras">
              Verduras
            </option>
          </select>

          <input
            type="number"
            placeholder="Precio"
            value={form.Price}
            onChange={(e) =>
              setForm({
                ...form,
                Price:
                  e.target.value,
              })
            }
            className="
              bg-zinc-950 border border-zinc-800
              rounded-2xl px-5 py-4
              text-white
            "
            required
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.Stock}
            onChange={(e) =>
              setForm({
                ...form,
                Stock:
                  e.target.value,
              })
            }
            className="
              bg-zinc-950 border border-zinc-800
              rounded-2xl px-5 py-4
              text-white
            "
            required
          />

          <input
            type="date"
            value={form.ExpirationDate}
            onChange={(e) =>
              setForm({
                ...form,
                ExpirationDate:
                  e.target.value,
              })
            }
            className="
              bg-zinc-950 border border-zinc-800
              rounded-2xl px-5 py-4
              text-white
            "
            required
          />

          <input
            type="text"
            placeholder="Proveedor"
            value={form.Supplier}
            onChange={(e) =>
              setForm({
                ...form,
                Supplier:
                  e.target.value,
              })
            }
            className="
              bg-zinc-950 border border-zinc-800
              rounded-2xl px-5 py-4
              text-white
            "
            required
          />

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() =>
                onOpenChange(false)
              }
              className="
                px-6 py-3 rounded-2xl
                bg-zinc-800 hover:bg-zinc-700
                text-white
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="
                px-6 py-3 rounded-2xl
                bg-emerald-500 hover:bg-emerald-400
                text-black font-semibold
              "
            >
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}