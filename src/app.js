const express = require('express');
const ProductManager = require('./ProductManager');


const manager = new ProductManager('../products.json');


const app = express();


app.get('/products', async (req, res) => {
    const limit = req.query.limit; // Obtiene el límite del query param
    const products = limit ? await manager.getProductsByLimit(limit) : await manager.getProducts();
    res.json(products);
  });

  app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const product = await manager.getProductById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  });

  const port = process.env.PORT || 8080; // Usa una variable de entorno o el puerto
  app.listen(port, () => {
console.log(`Servidor escuchando en el puerto ${port}`);
  });