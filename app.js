const express = require("express");
const app = express();
const fs = require("fs").promises;
const ProductManager = require("./classes/ProductManager");
const CartManager = require("./classes/CartManager");
const productManager = new ProductManager();
const cartManager = new CartManager();
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');

const productRouter = require("./routers/ProductRouter")(productManager);

app.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realtimeProducts', { products });
});

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.emit('productsUpdated', productManager.getProducts());

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const cartRouter = require("./routers/CartRouter")(express, cartManager);

app.use(express.json());

const PORT = 8080;

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Aplicación funcionando en el puerto ${PORT}`);
});
