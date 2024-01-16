const express = require("express");
const app = express();
const ProductManager = require("./ProductManager");
const productManager = new ProductManager(); 

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/products", (req, res) => {
try {
    const limit = parseInt(req.query.limit);
    let products = productManager.getProducts();

    if (!isNaN(limit)) {
    products = products.slice(0, limit);
    }

    res.json(products);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

app.get("/products/:id", (req, res) => {
try {
    const productId = parseInt(req.params.id);
    const product = productManager.getProductById(productId);

    res.json(product);
} catch (error) {
    res.status(404).json({ error: error.message });
}
});

app.listen(3000, () => {
    console.log("Aplicación funcionando en el puerto 3000")
})