const express = require('express');
const {
  register,
  login,
  fetchUser,
  uploadImage,
  logout,
} = require('../Controller/AuthController');
const uploads = require('../Middleware/fileupload');
const auth = require('../Middleware/auth');

const router = express.Router();

router.post('/register', uploads.single('profile_image'), register);
router.post('/login', login);
router.get('/me', auth, fetchUser);
router.post(
  '/upload-profile',
  auth,
  uploads.single('profile_image'),
  uploadImage
);
router.post('/logout', auth, logout);

module.exports = router;
