const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CookieParser = require('cookie-parser');

const register = async (req, res) => {
  try {
    const { username, password, email, contact } = req.body;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!username || !email || !password || !contact) {
      return res.status(400).json({ message: 'All fields are Required!' });
    }
    //check if user already exists by username or email
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE username=? or email=?',
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User already exists!' });
    }
    //hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //store to database
    await db.execute(
      'INSERT INTO users (username,email,contact,password,profile_image) VALUES(?,?,?,?,?) ',
      [username, email, contact || null, hashedPassword, profile_image]
    );
    res.status(201).json({ message: 'User Registered  Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    //check user
    const [users] = await db.execute(
      'SELECT * FROM users WHERE username=? or email=?',
      [username, username]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'Invalid User Details' });
    }
    const user = users[0];
    //verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password' });
    }
    //create Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPRIYIN,
    });
    const maxAge = process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000;
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: maxAge,
    });
    res.status(200).json({ message: 'Login Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
//verify User Cookie
const fetchUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [user] = await db.execute(
      'SELECT id,username,email,contact,profile_image FROM users WHERE id=?',
      [user_id]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//Upload Profile
const uploadImage = async (req, res) => {
  try {
    const user_id = req.user.id;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await db.execute(
      'UPDATE users SET  profile_image=? WHERE id=?',
      [profile_image, user_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not Found' });
    }
    res.json({ message: 'Profile Image Uploaded', profile_image });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
module.exports = { register, login, fetchUser, uploadImage, logout };
