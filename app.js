const express = require("express");
const app = express();
const fs = require("fs").promises;
const ProductManager = require("./classes/ProductManager");
const CartManager = require("./classes/CartManager");
const productManager = new ProductManager();
const cartManager = new CartManager();
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils";

const productRouter = require("./routers/ProductRouter")(productManager);
const cartRouter = require("./routers/CartRouter")(express, cartManager);

app.use(express.json());

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Aplicación funcionando en el puerto ${PORT}`);
});
