import fs from "fs";

class CartManager {
  constructor() {
    this.cartsFile = new FileManager('carritos.json');
  }

  async getCartsFromFile() {
    return this.cartsFile.readData();
  }

  async addCartToFile(cart) {
    const carts = await this.getCartsFromFile();
    carts.push(cart);
    await this.cartsFile.writeData(carts);
  }

  async getCartByIdFromFile(cartId) {
    const carts = await this.getCartsFromFile();
    return carts.find(cart => cart.id === cartId);
  }

  async addProductToCart(cartId, productId, quantity) {
    const carts = await this.getCartsFromFile();
    const cartIndex = carts.findIndex(cart => cart.id === cartId);

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);

      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += quantity;
      } else {
        carts[cartIndex].products.push({ id: productId, quantity });
      }

      await this.cartsFile.writeData(carts);
      return carts[cartIndex];
    }

    return null;
  }
}

class FileManager {
  constructor(fileName) {
    this.fileName = fileName;
  }

  async readData() {
    try {
      const data = await fs.readFile(this.fileName, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      return [];
    }
  }

  async writeData(data) {
    await fs.writeFile(this.fileName, JSON.stringify(data, null, 2));
  }
}

let cartManager = new CartManager
export default cartManager;