# Cambios realizados — MercadoPro POS

## Archivos modificados

### `src/app/components/Sales.tsx`
Componente principal del Punto de Venta. Cambios:

1. **Lector de código de barras**
   - Campo de entrada siempre visible en la parte superior del POS
   - Busca por: ID de producto, nombre parcial, o código de barras (campo `Barcode` en BD)
   - Se activa al presionar Enter
   - Se enfoca automáticamente al cargar la pantalla
   - Muestra toast de confirmación o error

2. **Campo de efectivo recibido**
   - Visible solo cuando el método de pago es "Efectivo"
   - Botones de billetes rápidos ($20, $50, $100, $200, $500 + total exacto)
   - Cálculo de cambio en tiempo real con indicador verde/rojo

3. **Cambio a entregar**
   - Se muestra dinámicamente mientras se escribe el efectivo
   - Verde si hay cambio a devolver
   - Rojo si el efectivo no alcanza
   - El botón "Cobrar" se deshabilita si el efectivo es insuficiente

4. **Método de pago**
   - Botones Efectivo / Tarjeta
   - Al elegir Tarjeta, se oculta el panel de efectivo/cambio

5. **Pantalla de venta exitosa**
   - Muestra folio generado
   - Desglose: total, efectivo recibido, cambio a entregar
   - Botón "Nueva venta" para reiniciar

6. **Filtro por categorías**
   - Barra de categorías dinámica basada en productos reales de la BD

### `backend/server.js`
Cambios en el backend:

1. **Nuevo endpoint `GET /products/search?q=...`**
   - Busca por `Barcode` exacto, `Id` numérico, o `Name` parcial
   - Útil para integrar con escáner físico de códigos de barras

2. **Campo `Barcode` en `POST /products`**
   - Se acepta y guarda el campo `Barcode` al crear productos

3. **Campo `FolioId` en `POST /sales`**
   - Permite agrupar múltiples ítems bajo un mismo folio de venta
   - Se recomienda generar el folio en frontend y enviarlo en cada POST de la venta

4. **`GET /sales/:id` mejorado**
   - Retorna detalle completo compatible con `SaleDetail.tsx`

## Migración de BD (SQL Server)

Para soportar códigos de barras y folios, agregar estas columnas:

```sql
-- Columna de código de barras en Products
ALTER TABLE Products ADD Barcode NVARCHAR(100) NULL;

-- Columna de folio en Sales (para agrupar ítems de una misma venta)
ALTER TABLE Sales ADD FolioId NVARCHAR(20) NULL;
```

## Uso del escáner físico

Un escáner USB de código de barras funciona como teclado:
envía el código y un Enter automático. El campo de barras
en la parte superior del POS lo capturará directamente
sin configuración adicional.
