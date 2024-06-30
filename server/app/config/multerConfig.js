const multer = require('multer');
const path = require('path');





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    },
  });
  
  // Initialize upload
  const upload = multer({ storage: storage });
  
  module.exports = upload;