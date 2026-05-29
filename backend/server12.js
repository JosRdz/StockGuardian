const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  connectionString: "Driver={ODBC Driver 17 for SQL Server};Server=HOOLIGANS;Database=GroceryDB;Trusted_Connection=yes;"
};

sql.connect(config)
  .then(() => console.log('Conectado a SQL Server'))
  .catch(err => console.log(err));

/* =========================
   PRODUCTOS (CON LOTES)
========================= */

// Obtener todos los productos con stock real
app.get('/products', async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT
        p.Id,
        p.Name,
        p.Category,
        p.Price,
        p.Supplier,
        ISNULL(SUM(l.Quantity), 0) AS Stock,
        MIN(l.ExpirationDate) AS ExpirationDate
      FROM Products p
      LEFT JOIN ProductLots l ON p.Id = l.ProductId
      GROUP BY p.Id, p.Name, p.Category, p.Price, p.Supplier
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Buscar producto por código de barras / nombre parcial / ID
app.get('/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).send('Falta parámetro q');

    const result = await sql.query`
      SELECT
        p.Id,
        p.Name,
        p.Category,
        p.Price,
        p.Supplier,
        ISNULL(SUM(l.Quantity), 0) AS Stock,
        MIN(l.ExpirationDate) AS ExpirationDate
      FROM Products p
      LEFT JOIN ProductLots l ON p.Id = l.ProductId
      WHERE p.Barcode = ${q}
         OR p.Id = TRY_CAST(${q} AS INT)
         OR p.Name LIKE ${'%' + q + '%'}
      GROUP BY p.Id, p.Name, p.Category, p.Price, p.Supplier
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Agregar producto (con lote)
app.post('/products', async (req, res) => {
  try {
    const { Name, Category, Price, Stock, ExpirationDate, Supplier, Barcode } = req.body;

    const existing = await sql.query`SELECT * FROM Products WHERE Name = ${Name}`;
    let productId;

    if (existing.recordset.length > 0) {
      productId = existing.recordset[0].Id;
    } else {
      const result = await sql.query`
        INSERT INTO Products (Name, Category, Price, Supplier, Barcode)
        OUTPUT INSERTED.Id
        VALUES (${Name}, ${Category}, ${Price}, ${Supplier}, ${Barcode || null})
      `;
      productId = result.recordset[0].Id;
    }

    await sql.query`
      INSERT INTO ProductLots (ProductId, Quantity, ExpirationDate)
      VALUES (${productId}, ${Stock}, ${ExpirationDate})
    `;

    res.send("Producto agregado con lote");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Reabastecer (nuevo lote)
app.post('/restock', async (req, res) => {
  try {
    const { productId, quantity, expirationDate } = req.body;
    await sql.query`
      INSERT INTO ProductLots (ProductId, Quantity, ExpirationDate)
      VALUES (${productId}, ${quantity}, ${expirationDate})
    `;
    res.send("Reabastecido correctamente");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Lotes por producto
app.get('/products/:id/lots', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query`
      SELECT Id, Quantity, ExpirationDate
      FROM ProductLots
      WHERE ProductId = ${id} AND Quantity > 0
      ORDER BY ExpirationDate ASC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

/* =========================
   VENTAS (FIFO + FOLIO)
========================= */

// Registrar venta individual (descuenta stock FIFO)
app.post('/sales', async (req, res) => {
  try {
    const { productId, quantity, folioId } = req.body;

    // Obtener lotes FIFO
    const lots = await sql.query`
      SELECT * FROM ProductLots
      WHERE ProductId = ${productId} AND Quantity > 0
      ORDER BY ExpirationDate ASC
    `;

    let remaining = quantity;
    for (const lot of lots.recordset) {
      if (remaining <= 0) break;
      const take = Math.min(lot.Quantity, remaining);
      await sql.query`
        UPDATE ProductLots SET Quantity = Quantity - ${take} WHERE Id = ${lot.Id}
      `;
      remaining -= take;
    }

    if (remaining > 0) return res.status(400).send("Stock insuficiente");

    const product = await sql.query`SELECT Price FROM Products WHERE Id = ${productId}`;
    const price = product.recordset[0].Price;

    await sql.query`
      INSERT INTO Sales (ProductId, Quantity, Total, Date, FolioId)
      VALUES (${productId}, ${quantity}, ${price * quantity}, GETDATE(), ${folioId || null})
    `;

    res.send("Venta realizada");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Historial de ventas
app.get('/sales', async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT
        s.Id,
        p.Name AS ProductName,
        s.Quantity,
        s.Total,
        s.Date,
        s.FolioId
      FROM Sales s
      JOIN Products p ON p.Id = s.ProductId
      ORDER BY s.Date DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Detalle de venta por ID
app.get('/sales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query`
      SELECT
        s.Id,
        p.Name AS productName,
        s.Quantity AS quantity,
        p.Price AS price,
        s.Total AS subtotal,
        s.Date AS date
      FROM Sales s
      JOIN Products p ON p.Id = s.ProductId
      WHERE s.Id = ${id}
    `;
    if (result.recordset.length === 0) return res.status(404).send("No encontrado");
    const row = result.recordset[0];
    res.json({
      id: row.Id,
      date: row.date,
      items: result.recordset.map(r => ({
        productName: r.productName,
        quantity: r.quantity,
        price: r.price,
        subtotal: r.subtotal,
      })),
      total: result.recordset.reduce((s, r) => s + r.subtotal, 0),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
