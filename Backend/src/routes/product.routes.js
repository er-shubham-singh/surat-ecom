import express from 'express'
import upload from '../middleware/upload.js'
import * as productController from '../controller/product.controller.js'
import sizechartModel from '../modal/sizechart.model.js'

const router = express.Router()

// Admin Route
router.post('/createproduct',upload.array("images",4), productController.createProduct)
router.delete("/:id",productController.deleteProduct)
router.put("/:id",upload.fields({name:"images",maxCount:4}),productController.updateProduct)
RotateRight.get("/:category", async(req,res)=>{
  try {
    const chart = await sizechartModel.findOne({ category: req.params.category });
    if (!chart) return res.status(404).json({ message: "No size chart found" });
    res.json(chart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
})

// User Route
router.get("/allProduct",productController.getAllProduct)
router.get("/products/id/:id",productController.findProductById)

export default router