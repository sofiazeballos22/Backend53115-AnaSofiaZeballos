const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async #readFile() {
    try {
      const content = await fs.promises.readFile(this.path, 'utf-8');
      // Verificar si el contenido está vacío antes de intentar analizarlo
      if (content.trim().length === 0) {
        return [];
      }
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Si el archivo no existe, inicializarlo con un arreglo vacío
        await fs.promises.writeFile(this.path, JSON.stringify([]));
        return [];
      } else {
        throw error;
      }
    }
  }

  async #writeFile(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async addProduct(product) {
    const products = await this.#readFile();
    let newId = 1;
    if (products.length > 0) {
      const maxId = Math.max(...products.map(p => p.id));
      newId = maxId + 1;
    }
    const newProduct = { ...product, id: newId };
    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
  }

  async getProducts() {
    return await this.#readFile();
  }

  async getProductById(id) {

const idNumber = Number(id);
    const productos = await this.#readFile();
  
    const productoEncontrado = productos.find(producto => producto.id === idNumber);
   
    return productoEncontrado;
  }
  async updateProduct(id, updatedProduct) {
    const products = await this.#readFile();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;
    products[productIndex] = { ...products[productIndex], ...updatedProduct, id: id };
    await this.#writeFile(products);
    return products[productIndex];
  }

  async deleteProduct(id) {
    let products = await this.#readFile();
    const filteredProducts = products.filter(product => product.id !== id);
    if (products.length === filteredProducts.length) return null;
    await this.#writeFile(filteredProducts);
    return id;
  }

  // Added function to get products by limit
  async getProductsByLimit(limit) {
    const products = await this.#readFile();
    if (limit) {
      return products.slice(0, limit); // Return first limit products
    } else {
      return products; // Return all products if no limit is provided
    }
  }
}

module.exports = ProductManager;

