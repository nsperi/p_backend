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