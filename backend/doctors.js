const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Doctor = require('./models/Doctor.js');

const doctors = [
  {
    firstName: 'Dr.Raja ',
    lastName: 'Kumar',
    email: 'raja@example.com',
    password: '111111',
    specialty: 'Cardiologist',
    licenseNumber: 'DOC123451',
    phoneNumber: '1234567890'
  },
  {
    firstName: 'Dr.Prakash',
    lastName: 'kumar',
    email: 'prakash@example.com',
    password: 'Password456',
    specialty: 'Dermatologist',
    licenseNumber: 'DOC67890',
    phoneNumber: '9876543210'
  },
  {
    firstName: 'Dr.Prashant',
    lastName: 'Singh',
    email: 'prashant@example.com',
    password: 'prashant@123',
    specialty: 'Orthopedic Surgeon',
    licenseNumber: 'DOC76543',
    phoneNumber: '9123456780'
  },
  {
    firstName: 'Dr.Priyanka',
    lastName: 'Devi',
    email: 'priyanka@example.com',
    password: 'Priyanka456',
    specialty: 'Gynecologist',
    licenseNumber: 'DOC23456',
    phoneNumber: '9876543211'
  },
  {
    firstName: 'Dr.Raj',
    lastName: 'kumar',
    email: 'raj@example.com',
    password: 'Raj@123',
    specialty: 'Neurologist',
    licenseNumber: 'DOC34567',
    phoneNumber: '9988776655'
  },
  {
    firstName: 'Dr.Rajat',
    lastName: 'singhaniya',
    email: 'rajat@example.com',
    password: 'rajat@123',
    specialty: 'Pediatrician',
    licenseNumber: 'DOC45678',
    phoneNumber: '9090909090'
  },
  {
    firstName: 'Dr.Pranjal',
    lastName: 'singh',
    email: 'pranjal@example.com',
    password: 'pranjal123',
    specialty: 'ENT Specialist',
    licenseNumber: 'DOC56789',
    phoneNumber: '9876501234'
  }
];


async function seedDoctors() {
  try {
    await mongoose.connect('mongodb://localhost:27017/JietDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    for (const doc of doctors) {
      const existing = await Doctor.findOne({ email: doc.email });
      if (!existing) {
        
        await Doctor.create(doc);
        console.log(`✅ Inserted doctor: ${doc.email}`);
      } else {
        console.log(`⚠️ Doctor already exists: ${doc.email}`);
      }
    }

    console.log('✅ Seeding complete.');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding doctors:', err);
    process.exit(1);
  }
}

module.exports =seedDoctors;
