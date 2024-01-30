const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = new Server(httpServer);
const fs = require("fs").promises;
const ProductManager = require("./classes/ProductManager");
const CartManager = require("./classes/CartManager");
const productManager = new ProductManager();
const cartManager = new CartManager();
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

const productRouter = require("./routers/ProductRouter")(productManager);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static("/public"));

app.get("/", (req, res) => {
    let testUser = {
        name: "Juan",
        last_name: "Perez"
    }
    res.render("realtimeProducts", testUser);
})

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

    socket.on('addProduct', (product) => {
        io.emit('productsUpdated', productManager.getProducts());
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const cartRouter = require("./routers/CartRouter")(express, cartManager);

app.use(express.json());

const PORT = 8080;

httpServer.listen(PORT, () => {
    console.log(`Aplicación funcionando en el puerto ${PORT}`);
});
