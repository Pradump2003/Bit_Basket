const { Router } = require("express");
const {
  addAddress,
  getAddress,
  editAddress,
  deleteAddress,
  getOneAddress,
} = require("../../controllers/shop/address.controllers");

const router = Router();

router.post("/add", addAddress);
router.get("/all", getAddress);
router.patch("/edit/:addressId", editAddress);
router.delete("/delete/:addressId", deleteAddress);
router.patch("/one/:addressId", getOneAddress);

module.exports = router;
