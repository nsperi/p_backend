const fs = require('fs');

class ProductManager {
    constructor() {
        this.filePath = './data/productos.json';
        this.products = [];
        this.idCounter = 1;
        this.loadFromFile();
    }

    loadFromFile() {
        try {
            const fileData = fs.readFileSync(this.filePath, 'utf8');
            this.products = JSON.parse(fileData);
            const lastProduct = this.products[this.products.length - 1];
            this.idCounter = lastProduct ? lastProduct.id + 1 : 1;
        } catch (error) {
            console.error('Error al cargar el archivo:', error.message);
        }
    }

    saveToFile() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
    }

    addProduct(productData) {
        try {
            if (this.products.some(product => product.code === productData.code)) {
                throw new Error(`Error: El código '${productData.code}' ya está en uso. No se pueden agregar productos duplicados.`);
            }

            productData.id = this.idCounter++;
            this.products.push(productData);

            this.saveToFile();

            return productData;
        } catch (error) {
            console.error(error.message);
        }
    }

    getProducts() {
        return this.products;
    }

    getXProducts(x) {
        return this.products.slice(0, x);
    }

    getProductById(productId) {
        try {
            const product = this.products.find(product => product.id === productId);

            if (!product) {
                throw new Error(`Error: No se encontró ningún producto con ID '${productId}'.`);
            }

            return product;
        } catch (error) {
            console.error(error.message);
        }
    }

    updateProduct(productId, updatedFields) {
        try {
            const productIndex = this.products.findIndex(product => product.id === productId);

            if (productIndex === -1) {
                throw new Error(`Error: No se encontró ningún producto con ID '${productId}'.`);
            }

            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
            this.saveToFile();

            return this.products[productIndex];
        } catch (error) {
            console.error(error.message);
        }
    }

    deleteProduct(productId) {
        try {
            const initialProductCount = this.products.length;
            this.products = this.products.filter(product => product.id !== productId);

            if (this.products.length === initialProductCount) {
                throw new Error(`Error: No se encontró ningún producto con ID '${productId}'.`);
            }

            this.saveToFile();
        } catch (error) {
            console.error(error.message);
        }
    }
}

module.exports = ProductManager;
