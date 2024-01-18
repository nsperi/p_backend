const express = require("express");
const app = express();
const fs = require("fs").promises; 
const ProductManager = require("./classes/ProductManager");
const productManager = new ProductManager();

const productRouter = express.Router();
const cartRouter = express.Router();

app.use(express.json());

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
