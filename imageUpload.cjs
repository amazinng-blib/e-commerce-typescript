// import cloudinary from 'cloudinary';
// import dotenv from 'dotenv';
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

cloudinary.v2;

dotenv.config();

// uploading single image
// const result = await cloudinary.v2.uploader.upload(
//   req.file.path,
//   (error, result) => {
//     console.log(result, error);
//   }

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'amazing1917',
  api_key: process.env.CLOUD_API_KEY || '466119532983772',
  api_secret: process.env.CLOUD_API_SECRET || 'rXNtC1phVGn79H2FPp4Nr7gOY9M',
});

const options = {
  overwrite: true,
  invalidate: true,
  resource_type: 'auto',
};

// 63c7f10383687997c0c4c450

// https://res.cloudinary.com/amazing1917/image/upload/v1674042109/1674042107545_0.jpg

// const upload = multer({ storage, fileFilter });

// const storage = multer.diskStorage({});
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, file.fieldname + '_' + Date.now());
//   } else {
//     cb('invalid image file', false);
//   }
// };

module.exports = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, options, (error, result) => {
      if (result) {
        // console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};
