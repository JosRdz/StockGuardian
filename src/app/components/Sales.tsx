import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Package,
} from "lucide-react";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

type Product = {
  Id: number;
  Name: string;
  Category: string;
  Price: number;
  Stock: number;
};

type CartItem = Product & {
  quantity: number;
};

export function Sales() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [cart, setCart] = useState<
    CartItem[]
  >([]);

  const [search, setSearch] =
    useState("");

  const userId =
    localStorage.getItem("userId");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/products/${userId}`
        );

      const data =
        await response.json();

      setProducts(data);

    } catch (error) {

      console.error(error);
    }
  };

  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (product) =>
          product.Name.toLowerCase().includes(
            search.toLowerCase()
          )
      );

    }, [products, search]);

  const addToCart = (
    product: Product
  ) => {

    const existing = cart.find(
      (item) =>
        item.Id === product.Id
    );

    const currentQty =
      existing?.quantity || 0;

    // 🔥 validar stock real
    if (
      currentQty >= Number(product.Stock)
    ) {

      toast.error(
        "Stock insuficiente"
      );

      return;
    }

    toast.success(
      "Producto agregado"
    );

    if (existing) {

      setCart((prev) =>
        prev.map((item) =>
          item.Id === product.Id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );

    } else {

      setCart((prev) => [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (
    id: number
  ) => {

    const product =
      products.find(
        (p) => p.Id === id
      );

    const cartItem =
      cart.find(
        (c) => c.Id === id
      );

    if (
      !product ||
      !cartItem
    ) return;

    if (
      cartItem.quantity >=
      Number(product.Stock)
    ) {

      toast.error(
        "Stock insuficiente"
      );

      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.Id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (
    id: number
  ) => {

    setCart((prev) =>
      prev
        .map((item) =>
          item.Id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  const removeItem = (
    id: number
  ) => {

    toast.success(
      "Producto eliminado"
    );

    setCart((prev) =>
      prev.filter(
        (item) =>
          item.Id !== id
      )
    );
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.Price) *
        item.quantity,
    0
  );

  const taxes =
    subtotal * 0.16;

  const total =
    subtotal + taxes;

  const handleCheckout =
    async () => {

      try {

        if (
          cart.length === 0
        ) {

          toast.error(
            "El carrito está vacío"
          );

          return;
        }

        for (const item of cart) {

          const response =
            await fetch(
              `${import.meta.env.VITE_API_URL}/sales`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  productId:
                    item.Id,

                  quantity:
                    item.quantity,

                  userId
                }),
              }
            );

          if (
            !response.ok
          ) {

            const msg =
              await response.text();

            toast.error(msg);

            return;
          }
        }

        toast.success(
          "Venta completada"
        );

        setCart([]);

        // 🔥 esperar commit MYSQL
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              400
            )
        );

        // 🔥 recargar inventario
        await loadProducts();

      } catch (error) {

        console.error(error);

        toast.error(
          "Error procesando venta"
        );
      }
    };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Punto de Venta
          </h1>

          <p className="text-zinc-400 mt-2">
            Gestión rápida de ventas
          </p>
        </div>

        <div
          className="
            bg-zinc-900 border border-zinc-800
            rounded-2xl px-5 py-3
          "
        >
          <p className="text-sm text-zinc-400">
            Productos
          </p>

          <h2 className="text-2xl font-bold text-emerald-400">
            {products.length}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
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
              "
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
            {filteredProducts.map(
              (
                product,
                index
              ) => (
                <motion.div
                  key={
                    product.Id
                  }
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
                      index *
                      0.03,
                  }}
                  className="
                    bg-zinc-900 border border-zinc-800
                    rounded-3xl p-5
                  "
                >
                  <div
                    className="
                      h-14 w-14 rounded-2xl
                      bg-emerald-500/10
                      flex items-center justify-center
                      mb-5
                    "
                  >
                    <Package className="h-7 w-7 text-emerald-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {
                      product.Name
                    }
                  </h3>

                  <p className="text-zinc-500 text-sm mt-1">
                    {
                      product.Category
                    }
                  </p>

                  <div className="mt-6">
                    <h2 className="text-3xl font-bold text-emerald-400">
                      $
                      {
                        product.Price
                      }
                    </h2>

                    <p className="text-zinc-500 text-sm mt-1">
                      Stock:
                      {
                        product.Stock
                      }
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      addToCart(
                        product
                      )
                    }
                    className="
                      mt-6 w-full
                      bg-emerald-500 hover:bg-emerald-400
                      text-black font-semibold
                      py-3 rounded-2xl
                    "
                  >
                    Agregar
                  </button>
                </motion.div>
              )
            )}
          </div>
        </div>

        <div
          className="
            bg-zinc-900 border border-zinc-800
            rounded-3xl p-6
          "
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Carrito
          </h2>

          <div className="space-y-4">
            {cart.map(
              (item) => (
                <div
                  key={item.Id}
                  className="
                    bg-zinc-800
                    rounded-2xl p-4
                  "
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-white font-semibold">
                        {
                          item.Name
                        }
                      </h3>

                      <p className="text-emerald-400">
                        $
                        {
                          item.Price
                        }
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(
                          item.Id
                        )
                      }
                    >
                      <Trash2 className="h-5 w-5 text-red-400" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.Id
                          )
                        }
                        className="
                          h-8 w-8 rounded-lg
                          bg-zinc-700
                        "
                      >
                        <Minus className="h-4 w-4 text-white mx-auto" />
                      </button>

                      <span className="text-white">
                        {
                          item.quantity
                        }
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.Id
                          )
                        }
                        className="
                          h-8 w-8 rounded-lg
                          bg-emerald-500
                        "
                      >
                        <Plus className="h-4 w-4 text-black mx-auto" />
                      </button>
                    </div>

                    <h3 className="text-white font-bold">
                      $
                      {(
                        item.Price *
                        item.quantity
                      ).toFixed(
                        2
                      )}
                    </h3>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-8 border-t border-zinc-800 pt-6 space-y-4">
            <div className="flex justify-between text-zinc-400">
              <span>
                Subtotal
              </span>

              <span>
                $
                {subtotal.toFixed(
                  2
                )}
              </span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>IVA</span>

              <span>
                $
                {taxes.toFixed(
                  2
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-xl font-semibold text-white">
                Total
              </span>

              <span className="text-3xl font-bold text-emerald-400">
                $
                {total.toFixed(
                  2
                )}
              </span>
            </div>

            <button
              onClick={
                handleCheckout
              }
              className="
                mt-4 w-full
                bg-emerald-500 hover:bg-emerald-400
                text-black font-bold
                py-4 rounded-2xl
              "
            >
              <CreditCard className="h-5 w-5 inline mr-2" />

              Cobrar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}