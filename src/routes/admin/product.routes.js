const { Router } = require("express");
const {
  uploadImage,
  deleteImage,
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/admin/product.controllers");
const upload = require("../../middlewares/multer.middlewares");

const router = Router();

router.post("/add-image", upload.single("image"), uploadImage);
router.patch("/delete-image", upload.none(), deleteImage);
router.post("/add", addProduct);
router.get("/all", getAllProducts);
router.get("/:id", getProduct);
router.patch("/edit/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
