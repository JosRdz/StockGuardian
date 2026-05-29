import { useState, useEffect, useRef } from 'react';
import { Search, Minus, Plus, X, ShoppingCart, CreditCard, Banknote, Barcode } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  stock: number;
  category: string;
}

type PayMethod = 'efectivo' | 'tarjeta';

export function Sales() {
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState('Todos');
  const [payMethod, setPayMethod] = useState<PayMethod>('efectivo');
  const [cashReceived, setCashReceived] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastSale, setLastSale] = useState<{ folio: string; total: number; change: number; cash: number } | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = () => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  const categories = ['Todos', ...Array.from(new Set(products.map((p: any) => p.Category).filter(Boolean)))];

  const filteredProducts = products.filter(product => {
    const matchSearch =
      product.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCat === 'Todos' || product.Category === activeCat;
    return matchSearch && matchCat;
  });

  // ── Código de barras ──────────────────────────────────────────
  const handleBarcodeSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const query = barcodeInput.trim().toLowerCase();
    if (!query) return;
    const found = products.find(
      p => p.Name?.toLowerCase().includes(query) || String(p.Id) === query
    );
    if (found) {
      addToCart(found.Id);
      setBarcodeInput('');
      toast.success(`${found.Name} agregado`);
    } else {
      toast.error('Producto no encontrado');
    }
    barcodeRef.current?.focus();
  };

  // ── Carrito ───────────────────────────────────────────────────
  const addToCart = (productId: number) => {
    const product = products.find(p => p.Id === productId);
    if (!product) return;
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      if (existing.quantity >= product.Stock) {
        toast.error('Stock insuficiente', { description: `Solo hay ${product.Stock} unidades.` });
        return;
      }
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      if (product.Stock < 1) { toast.error('Sin stock disponible'); return; }
      setCart([...cart, {
        productId: product.Id, productName: product.Name,
        quantity: 1, price: product.Price, subtotal: product.Price,
        stock: product.Stock, category: product.Category || '',
      }]);
    }
  };

  const updateQuantity = (productId: number, newQty: number) => {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;
    if (newQty < 1) { removeFromCart(productId); return; }
    if (newQty > item.stock) { toast.error('Stock insuficiente'); return; }
    setCart(cart.map(ci =>
      ci.productId === productId
        ? { ...ci, quantity: newQty, subtotal: newQty * ci.price }
        : ci
    ));
  };

  const removeFromCart = (productId: number) => setCart(cart.filter(i => i.productId !== productId));

  const clearCart = () => {
    setCart([]); setCashReceived(''); setShowConfirm(false); setLastSale(null);
  };

  // ── Totales ───────────────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.subtotal, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;
  const cashNum = parseFloat(cashReceived) || 0;
  const change = cashNum - total;
  const quickBills = [20, 50, 100, 200, 500, Math.ceil(total / 10) * 10].filter((v, i, a) => a.indexOf(v) === i);

  // ── Confirmar venta ───────────────────────────────────────────
  const confirmSale = async () => {
    if (cart.length === 0) { toast.error('Carrito vacío'); return; }
    if (payMethod === 'efectivo' && cashNum < total) {
      toast.error('Efectivo insuficiente'); return;
    }
    try {
      for (const item of cart) {
        await fetch('http://localhost:3001/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
        });
      }
      const folio = 'V-' + String(Math.floor(Math.random() * 9000) + 1000);
      setLastSale({ folio, total, cash: cashNum, change: payMethod === 'efectivo' ? change : 0 });
      setShowConfirm(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error('Error al registrar la venta');
    }
  };

  // ── Pantalla de venta exitosa ─────────────────────────────────
  if (lastSale) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="text-5xl">✅</div>
            <h2 className="text-2xl font-bold">Venta registrada</h2>
            <p className="text-muted-foreground">Folio: <strong>{lastSale.folio}</strong></p>
            <div className="bg-muted rounded-lg p-4 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total cobrado</span>
                <span className="font-bold text-primary text-xl">${lastSale.total.toFixed(2)}</span>
              </div>
              {payMethod === 'efectivo' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efectivo recibido</span>
                    <span className="font-semibold">${lastSale.cash.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-green-700">Cambio a entregar</span>
                    <span className="font-bold text-green-700 text-xl">${lastSale.change.toFixed(2)}</span>
                  </div>
                </>
              )}
              {payMethod === 'tarjeta' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método de pago</span>
                  <span className="font-semibold">💳 Tarjeta</span>
                </div>
              )}
            </div>
            <Button className="w-full mt-4" size="lg" onClick={clearCart}>
              Nueva venta
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Vista POS principal ───────────────────────────────────────
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Punto de Venta</h1>
        <p className="text-muted-foreground">Registre ventas y gestione el carrito</p>
      </div>

      {/* Lector de código de barras */}
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center gap-3">
            <Barcode className="h-5 w-5 text-primary flex-shrink-0" />
            <Input
              ref={barcodeRef}
              placeholder="Escanear código o escribir nombre del producto y presionar Enter..."
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              onKeyDown={handleBarcodeSearch}
              className="font-mono bg-background"
              autoFocus
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">↵ Enter</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Productos */}
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Buscar por nombre o categoría..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap pt-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      activeCat === cat
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {filteredProducts.map(product => {
                  const outOfStock = product.Stock <= 0;
                  const lowStock = product.Stock > 0 && product.Stock <= 5;
                  return (
                    <Card
                      key={product.Id}
                      className={`cursor-pointer transition-all select-none ${
                        outOfStock
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:border-primary hover:bg-accent active:scale-95'
                      }`}
                      onClick={() => !outOfStock && addToCart(product.Id)}
                    >
                      <CardContent className="p-3 space-y-1">
                        <p className="font-semibold text-sm leading-tight line-clamp-2">{product.Name}</p>
                        <p className="text-xs text-muted-foreground">{product.Category}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-bold text-primary text-sm">${product.Price}</span>
                          <Badge
                            variant={outOfStock ? 'destructive' : 'secondary'}
                            className={lowStock ? 'bg-orange-100 text-orange-700 border-orange-300' : ''}
                          >
                            {outOfStock ? 'Sin stock' : `${product.Stock} uds`}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-muted-foreground">
                    <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Sin resultados</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carrito + cobro */}
        <div className="space-y-4">

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Ticket ({cart.reduce((s, i) => s + i.quantity, 0)} artículos)
                </CardTitle>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive h-7 px-2 text-xs">
                    <X className="h-3.5 w-3.5 mr-1" /> Vaciar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Carrito vacío</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="border rounded-lg p-2.5 space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-medium leading-tight flex-1 line-clamp-2">{item.productName}</p>
                      <button onClick={() => removeFromCart(item.productId)} className="text-muted-foreground hover:text-destructive flex-shrink-0 mt-0.5">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-accent">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-accent">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">${item.price} c/u</p>
                        <p className="text-sm font-bold text-primary">${item.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Panel de cobro */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Cobro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">

              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>IVA (16%)</span><span>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Método de pago */}
              <div className="grid grid-cols-2 gap-2">
                {(['efectivo', 'tarjeta'] as PayMethod[]).map(m => (
                  <button
                    key={m}
                    onClick={() => { setPayMethod(m); setCashReceived(''); }}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      payMethod === m
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    {m === 'efectivo'
                      ? <><Banknote className="h-4 w-4" /> Efectivo</>
                      : <><CreditCard className="h-4 w-4" /> Tarjeta</>
                    }
                  </button>
                ))}
              </div>

              {/* Efectivo + cambio */}
              {payMethod === 'efectivo' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Efectivo recibido</label>
                  <Input
                    type="number"
                    placeholder="$0.00"
                    value={cashReceived}
                    onChange={e => setCashReceived(e.target.value)}
                    className="text-right font-mono text-base"
                    min={0}
                    step={0.01}
                  />

                  {/* Billetes rápidos */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {quickBills.map(bill => (
                      <button
                        key={bill}
                        onClick={() => setCashReceived(String(bill))}
                        className="py-1.5 text-xs font-semibold rounded border border-border hover:border-primary hover:text-primary transition-colors bg-background"
                      >
                        ${bill}
                      </button>
                    ))}
                  </div>

                  {/* Resultado cambio */}
                  {cashNum > 0 && (
                    <div className={`rounded-lg p-3 flex justify-between items-center border ${
                      change >= 0
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                        : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                    }`}>
                      <span className={`text-sm font-semibold ${change >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {change >= 0 ? 'Cambio a entregar' : 'Faltan'}
                      </span>
                      <span className={`text-xl font-bold ${change >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ${Math.abs(change).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowConfirm(true)}
                disabled={
                  cart.length === 0 ||
                  (payMethod === 'efectivo' && cashReceived !== '' && cashNum < total)
                }
              >
                Cobrar ${total.toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Confirmar venta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.productName} ×{item.quantity}</span>
                    <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>IVA</span><span>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
                </div>
                {payMethod === 'efectivo' && cashNum > 0 && (
                  <div className="flex justify-between font-bold text-green-700 dark:text-green-400">
                    <span>Cambio</span><span>${change.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground pt-1">
                  <span>Pago con</span>
                  <span>{payMethod === 'efectivo' ? '💵 Efectivo' : '💳 Tarjeta'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>Cancelar</Button>
                <Button className="flex-1" onClick={confirmSale}>Confirmar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
