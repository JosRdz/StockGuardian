import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

type Product = {
  Id: number;
  Name: string;
};

type Props = {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;

  onSuccess: () => void;
};

export function RestockDialog({
  open,
  onOpenChange,
  onSuccess,
}: Props) {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [form, setForm] =
    useState({
      productId: "",
      quantity: "",
      expirationDate: "",
    });

  const userId =
    localStorage.getItem("userId");

  useEffect(() => {

    if (open) {

      fetch(
        `${import.meta.env.VITE_API_URL}/products/${userId}`
      )
        .then((res) =>
          res.json()
        )
        .then(setProducts);
    }

  }, [open]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await fetch(
        `${import.meta.env.VITE_API_URL}/restock`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productId: Number(
              form.productId
            ),

            quantity: Number(
              form.quantity
            ),

            expirationDate:
              form.expirationDate,

            userId
          }),
        }
      );

      toast.success(
        "Producto reabastecido"
      );

      onSuccess();

      onOpenChange(false);

      setForm({
        productId: "",
        quantity: "",
        expirationDate: "",
      });

    } catch (error) {

      toast.error(
        "Error reabasteciendo"
      );
    }
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/60 backdrop-blur-sm
        flex items-center justify-center
        p-6
      "
    >
      <div
        className="
          w-full max-w-xl
          bg-zinc-900 border border-zinc-800
          rounded-3xl p-8
        "
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Reabastecer Producto
            </h2>

            <p className="text-zinc-400 mt-2">
              Registrar nuevo lote FIFO
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
          className="space-y-5"
        >
          <select
            value={form.productId}
            onChange={(e) =>
              setForm({
                ...form,
                productId:
                  e.target.value,
              })
            }
            className="
              w-full
              bg-zinc-950 border border-zinc-800
              rounded-2xl px-5 py-4
              text-white
            "
            required
          >
            <option value="">
              Seleccionar producto
            </option>

            {products.map(
              (product) => (
                <option
                  key={product.Id}
                  value={product.Id}
                >
                  {product.Name}
                </option>
              )
            )}
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity:
                  e.target.value,
              })
            }
            className="
              w-full
              bg-zinc-950 border border-zinc-800
              rounded-2xl px-5 py-4
              text-white
            "
            required
          />

          <input
            type="date"
            value={form.expirationDate}
            onChange={(e) =>
              setForm({
                ...form,
                expirationDate:
                  e.target.value,
              })
            }
            className="
              w-full
              bg-zinc-950 border border-zinc-800
              rounded-2xl px-5 py-4
              text-white
            "
            required
          />

          <div className="flex justify-end gap-4 pt-4">
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
              Guardar Lote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}