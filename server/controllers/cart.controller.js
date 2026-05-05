const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const { productId, name, price, image, quantity } = req.body;
  const userId = req.user.id; // Assumes you have auth middleware setting req.user

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if product exists in cart
      const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += (quantity || 1);
      } else {
        cart.items.push({ productId, name, price, image, quantity });
      }
      cart.totalAmount = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create new cart
      const newCart = await Cart.create({
        userId,
        items: [{ productId, name, price, image, quantity }],
        totalAmount: price * (quantity || 1)
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};