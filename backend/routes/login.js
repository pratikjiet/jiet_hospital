const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin'); // Add this line
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, role } = req.body;
console.log(email,password,role);
  console.log('Received data:', req.body);

  try {
    let user;
    if (role === 'doctor') {
      user = await Doctor.findOne({ email });   
      console.log(user)
    } else if (role === 'admin') {
      console.log('hello')
      user = await Admin.findOne({ email ,role});
    } else {
      user = await User.findOne({ email, role });
    }
    console.log(user)
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '24h' });
    res.send({ token, role: user.role });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
