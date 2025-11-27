const express=require("express");
const router=express.Router();
const productController=require("../controllers/product.controller.js");
const upload = require("../middleware/upload.js");
const { default: SizeChart } = require("../models/sizechart.model.js");


router.post('/', upload.array("images", 4),productController.createProduct);
router.post('/creates', productController.createMultipleProduct);
router.delete('/:id', productController.deleteProduct);
router.put(
  '/:id',
  upload.fields([{ name: "images", maxCount: 4 }]),
  productController.updateProduct
);
router.get("/:category", async (req, res) => {
  try {
    const chart = await SizeChart.findOne({ category: req.params.category });
    if (!chart) return res.status(404).json({ message: "No size chart found" });
    res.json(chart);
  } catch (err) {
    res.status(500).json({ message: "Server error" ,err});
  }
});

module.exports=router;