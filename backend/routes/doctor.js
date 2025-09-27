const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Replace with your actual JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// @route    POST /api/doctors/register
// @desc     Register a new doctor
// @access   Public
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      specialty,
      licenseNumber,
      phoneNumber
    } = req.body;

    // Check for missing fields
    if (!firstName || !lastName || !email || !password || !specialty || !licenseNumber || !phoneNumber) {
      return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists.' });
    }

    const existingLicense = await Doctor.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ message: 'License number is already registered.' });
    }

    // Create new doctor (password will be hashed by pre-save hook)
    const doctor = new Doctor({
      firstName,
      lastName,
      email,
      password,
      specialty,
      licenseNumber,
      phoneNumber
    });

    await doctor.save();

    res.status(201).json({ message: 'Doctor registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route    POST /api/doctors/login
// @desc     Login doctor
// @access   Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Check doctor exists
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: doctor._id,
        email: doctor.email,
        role: doctor.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialty: doctor.specialty,
        licenseNumber: doctor.licenseNumber,
        phoneNumber: doctor.phoneNumber,
        role: doctor.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
