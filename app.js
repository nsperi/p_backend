const express = require("express");
const app = express();
const fs = require("fs").promises; 
const ProductManager = require("./ProductManager");
const productManager = new ProductManager();

const productRouter = express.Router();
const cartRouter = express.Router();

app.use(express.json());

// Rutas de productos
productRouter.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        let products = await productManager.getProductsFromFile();

        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || [],
        };

        await productManager.addProductToFile(newProduct);
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productData = req.body;

        const updatedProduct = await productManager.updateProductById(productId, productData);

        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        const deletedProduct = await productManager.deleteProductById(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rutas de carritos
cartRouter.post('/', async (req, res) => {
    try {
      const newCart = {
        id: await productManager.generateNewProductId(),
        products: [],
      };
  
      await cartManager.addCartToFile(newCart);
  
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  cartRouter.get('/:cid', async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartManager.getCartByIdFromFile(cartId);
  
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: 'Carrito no encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = parseInt(req.params.pid);
      const { quantity } = req.body;
  
      const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
  
      if (updatedCart) {
        res.status(201).json(updatedCart);
      } else {
        res.status(404).json({ error: 'Carrito no encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Manejo de archivos y persistencia
class FileManager {
    constructor(fileName) {
        this.fileName = fileName;
    }

    async readData() {
        try {
            const data = await fs.readFile(this.fileName, "utf-8");
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    async writeData(data) {
        await fs.writeFile(this.fileName, JSON.stringify(data, null, 2));
    }
}

class ProductManager {
    constructor() {
        this.productsFile = new FileManager("productos.json");
    }

    async getProductsFromFile() {
        return this.productsFile.readData();
    }

    async addProductToFile(product) {
        const products = await this.getProductsFromFile();
        products.push(product);
        await this.productsFile.writeData(products);
    }

    async updateProductById(productId, productData) {
        const products = await this.getProductsFromFile();
        const index = products.findIndex(product => product.id === productId);

        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            await this.productsFile.writeData(products);
            return products[index];
        }

        return null;
    }

    async deleteProductById(productId) {
        const products = await this.getProductsFromFile();
        const index = products.findIndex(product => product.id === productId);

        if (index !== -1) {
            const deletedProduct = products.splice(index, 1);
            await this.productsFile.writeData(products);
            return deletedProduct[0];
        }

        return null;
    }
}

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Aplicación funcionando en el puerto ${PORT}`);
});
