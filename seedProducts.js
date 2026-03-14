const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
    {
        name: 'The Golden Crest T-Shirt',
        description: 'Elite luxury t-shirt crafted from 100% Egyptian cotton. Features a hand-sewn gold diamond crest.',
        price: 4500,
        materials: 'Egyptian Cotton, Silk Thread',
        segment: 'men',
        category: 't-shirts',
        season: 'All-Season',
        images: ['/uploads/tshirt_gold.png'],
        sizes: [
            { size: 'M', stock: 15 },
            { size: 'L', stock: 20 },
            { size: 'XL', stock: 10 }
        ]
    },
    {
        name: 'Midnight Onyx Silhouette',
        description: 'Matte black minimalist t-shirt with signature gold branding. A staple for the modern nocturne.',
        price: 3800,
        materials: 'Organic Pima Cotton',
        segment: 'men',
        category: 't-shirts',
        season: 'Winter',
        images: ['/uploads/tshirt_black.png'],
        sizes: [
            { size: 'S', stock: 5 },
            { size: 'M', stock: 12 },
            { size: 'L', stock: 18 }
        ]
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for product seeding');

        // Remove all existing products (including furniture)
        await Product.deleteMany({});
        console.log('Removed existing products');

        // Insert new t-shirts
        await Product.insertMany(products);
        console.log('Seeded 2 luxury T-shirts successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();
