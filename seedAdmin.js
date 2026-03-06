const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'mohamedabyazm.23csd@kongu.edu';
        const adminPassword = 'pass123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const newAdmin = new User({
            username: 'Administrator',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();
        console.log('Admin user successfully created!');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
