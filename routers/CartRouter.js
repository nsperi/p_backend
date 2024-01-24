module.exports = (cartManager) => {
  const cartRouter = require("./routers/CartRouter")(cartManager);

    cartRouter.post('/', async (req, res) => {
        try {
            const newCart = {
                id: await cartManager.generateNewCartId(),
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

    return cartRouter;
};
  
  