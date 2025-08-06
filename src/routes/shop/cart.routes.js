const { Router } = require("express");
const authenticate = require("../../middlewares/auth.middlewares");
const {
  addToCart,
  fetchCartItems,
  updateCartItem,
  deleteCartItems,
  clearCart,
} = require("../../controllers/shop/cart.controllers");

const router = Router();

router.post("/add", addToCart);
router.get("/get", fetchCartItems);
router.patch("/update", updateCartItem);
router.delete("/delete/:productId", deleteCartItems);
router.delete("/clear", clearCart);

module.exports = router;
