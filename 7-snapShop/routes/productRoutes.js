const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');
const authMiddleware = require('../middlewares/authmiddleware');
const { uploadSingleImage } = require('../middlewares/uploadMiddleware');

router.post('/', authMiddleware, uploadSingleImage('imageUrl'), productController.createProduct);
router.get('/', authMiddleware, productController.getProducts);
module.exports = router;