const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await Product.find({});
        console.log('--- PRODUCTS ---');
        console.log(JSON.stringify(products, null, 2));
        
        const User = require('./models/User');
        const users = await User.find({});
        console.log('--- USERS ---');
        console.log(JSON.stringify(users, null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkProducts();
