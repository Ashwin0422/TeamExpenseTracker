const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'expenses/invoices',
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPG, PNG, WEBP, and PDF files are allowed'));
  },
});

module.exports = { cloudinary, upload };