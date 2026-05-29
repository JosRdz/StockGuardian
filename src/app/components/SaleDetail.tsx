import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

export function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState<any>(null);

  // 🔥 traer venta real
  useEffect(() => {
    if (!id) return;

    fetch(`${import.meta.env.VITE_API_URL}/sales/${id}`)
      .then(res => res.json())
      .then(data => setSale(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!sale) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/sales-history')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Venta no encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX') + " " + date.toLocaleTimeString('es-MX');
  };

  const totalQuantity = sale.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  return (
    <div className="space-y-6">

      <Button variant="outline" onClick={() => navigate('/sales-history')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Historial
      </Button>

      <h1>Detalle de Venta</h1>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>
              <Badge>{sale.id}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>ID de Venta</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Calendar className="h-4 w-4" />
              Fecha
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formatDateTime(sale.date)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <ShoppingBag className="h-4 w-4" />
              Total Unidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalQuantity}
          </CardContent>
        </Card>

      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sale.items?.map((item: any, i: number) => (
                <TableRow key={i}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>${item.subtotal}</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell>${sale.total}</TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}