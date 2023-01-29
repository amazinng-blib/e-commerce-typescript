const express = require('express');
const fs = require('fs');
const expressAsyncHandler = require('express-async-handler');
const AllProduct = require('../models/productModels.js');
const data = require('../data.js');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'amazing1917',
  api_key: process.env.CLOUD_API_KEY || '466119532983772',
  api_secret: process.env.CLOUD_API_SECRET || 'rXNtC1phVGn79H2FPp4Nr7gOY9M',
});

const multer = require('multer');
const User = require('../models/userModels.js');
const { isAuth } = require('../utils.js');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toString() + '_' + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/jpeg' ||
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'jpg'
//   ) {
//     cb(null, true);
//   } else {
//     // reject file
//     cb({ message: ' Unsopported file format' }, false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 },
//   fileFilter: fileFilter,
// });

const upload = multer({ dest: 'uploads/' });

const productRouter = express.Router();

// GET ALL PRODUCTS

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    // await AllProduct.insertMany(data);
    const documents = await AllProduct.countDocuments({});
    const products = await AllProduct.find({});
    if (!products) {
      return res.status(500).json({
        message:
          'Internal Server error. This could be as a result of poor network connection',
      });
    }
    res.status(200).json({ products, documents, message: 'success' });
  })
);

productRouter.get(
  '/home',
  expressAsyncHandler(async (req, res) => {
    const products = await AllProduct.find({}).select('-user');
    if (!products) {
      res.status(404).send('Product Not Found');
    }

    res.status(201).json({ products, message: 'Success' });
  })
);

// GET PRODUCTS CATEGORIES
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await AllProduct.find({}).distinct('category');
    res.status(200).send(categories);
  })
);

// GET PRODUCT BY NAME

productRouter.get(
  '/name/:name',
  expressAsyncHandler(async (req, res) => {
    const findProductByName = await AllProduct.findOne({
      name: req.params.name,
    });

    if (findProductByName) {
      res.status(201).send(findProductByName);
    }

    if (!findProductByName) {
      res
        .status(404)
        .send(
          'message: Dear valuable customer, the specified PRODUCT is not in our stock.'
        );
    }
  })
);

// GET PRODUCT BY ID
productRouter.get(
  '/:productId',
  expressAsyncHandler(async (req, res) => {
    const findProductById = await AllProduct.findOne({
      _id: req.params.productId,
    }).select('-user');

    if (!findProductById) {
      res
        .status(404)
        .send(
          'message: Dear valuable customer, the specified PRODUCT is not in our stock.'
        );
    }

    res.status(201).send(findProductById);
  })
);

// CREATE PRODUCT

productRouter.post(
  '/create',
  upload.array('image'),
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // console.log({
    //   files: req.files,
    //   body: req.body,
    // });

    let files = req.files;
    // path is where our local image url sits

    if (!files || files.length === 0) {
      res.status(400).send('No picture attached');
    }

    // BELOW FUNCTION MAPS OUT OUR IMAGE AND STORES IT RESOLVE RESPONSE AS AN ARRAY
    let multiplePicturePromise = files.map((picture, index) =>
      cloudinary.v2.uploader.upload(picture.path, {
        public_id: `${Date.now()}_${index}`,
        height: 400,
        width: 400,
        crop: 'fill',
      })
    );
    // console.log('here');

    // BELOW RETURNS THE RESOLVED PROMISE OF MULTIPLEPICTUREPROMISE AS AN ARRAY OF OBJECT
    // THAT CAN BE MAPPED
    const imageResponse = await Promise.all(multiplePicturePromise);

    // BELOW MAPS THE IMAGERESPONSE AND EXTRACT THE SECURE_URL THAT WAS SENT BACK FROM CLOUDINARY

    const imageUrl = imageResponse.map((image) => {
      const url = image.secure_url;
      const publicId = image.public_id;
      // console.log(publicId);
      return { url, publicId };
    });

    // console.log(imageUrl);

    const newProduct = await AllProduct.create({
      name: req?.body?.name,
      image: imageUrl,
      category: req?.body?.category,
      rating: req?.body?.rating,
      numReviews: req?.body?.numReviews,
      countInStock: req?.body?.countInStock,
      description: req?.body?.description,
      price: req?.body?.price,
      user: {
        userId: req.user?._id,
        username: req.user?.name,
      },
    });

    if (newProduct) {
      res.status(201).json({ message: 'success', newProduct });
    }
  })
);

//   '/create',
//   upload.array('image'),
//   expressAsyncHandler(async (req, res) => {
//     let files = req.files;
//     console.log(files);

//     if (!files || files.length === 0) {
//       res.status(400).send('No picture attached');
//     }

//     let multiplePicturePromise = files.map((picture, index) =>
//       cloudinary.v2.uploader.upload(picture.path, {
//         public_id: `${Date.now()}_${index}`,
//         height: 400,
//         width: 400,
//         crop: 'fill',
//       })
//     );

//     // BELOW FUNCTION RETURNS ARRAY OF RESOLVED PART OF MULTIPLEPICTUREPROMISE FUNCTION
//     const imageResponse = await Promise.all(multiplePicturePromise);

//     // BELOW IS WHERE THE RETURNED ARRAY IS MAPPED
//     // const imageUrl = imageResponse.map((image) => {
//     //   const url = image.secure_url;
//     //   return { url };
//     // });

//     // console.log('hello');

//     // const createdProduct = await AllProduct.create({
//     //   name: req.body.name,
//     //   image: [...imageUrl],
//     //   category: req.body.category,
//     //   rating: req.body.rating,
//     //   numReviews: req.body.numReviews,
//     //   price: req.body.price,
//     //   description: req.body.description,
//     // });

//     // res.status(201).json({ message: 'Product created successfully' });
//   })
// );

// UPDATE PRODUCT

// UPDATE PRODUCTS

productRouter.put(
  '/update/:id',
  upload.array('image'),
  expressAsyncHandler(async (req, res) => {
    const product = await AllProduct.findById(req.params.id);
    // console.log(product);

    // console.log(req.files);

    let files = req.files;

    if (!files || files.length === 0) {
      res.status(400).send('No picture attached');
    }

    let multiplePicturePromise = files.map((picture, index) =>
      cloudinary.v2.uploader.upload(picture.path, {
        public_id: `${Date.now()}_${index}`,
        height: 900,
        width: 1400,
        crop: 'pad',
      })
    );

    const imageResponse = await Promise.all(multiplePicturePromise);

    // return res.send(imageResponse);

    const imageUrl = imageResponse.map((image) => {
      const url = image.secure_url;
      return { url };
    });

    product.image = [...product.image, ...imageUrl];
    product.name = req.body.name;
    product.countInStock = req.body.countInStock;
    product.price = req.body.price;
    product.rating = req.body.rating;
    product.numReviews = req.body.numReviews;
    product.category = req.body.category;

    const updated = await product.save();

    if (!updated) {
      return res.status(500).json({
        message: "Couldn't update product",
      });
    }

    res.status(201).json({
      message: 'Product updated successfully',
    });
  })
);

// DELETE PRODUCT BY ID

productRouter.delete(
  '/delete/:productId',
  expressAsyncHandler(async (req, res) => {
    const product = await AllProduct.findOne({ _id: req.params.productId });
    if (!product) {
      return res
        .status(404)
        .send('You cant delete an empty space. Product do not exist');
    }

    if (product) {
      await product.remove();
    }

    const deleteImageFromCloudinary = product?.image.map((x) => {
      // console.log(x.publicId);
      const result = cloudinary.v2.uploader.destroy(x.publicId);

      return result;
    });

    const del = await Promise.all(deleteImageFromCloudinary);

    if (del) {
      res.send('Product Successfully Deleted');
    }
  })
);

module.exports = { productRouter };
