require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const CarouselItem = require('./models/CarouselItem');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB for seeding');
        await CarouselItem.deleteMany({});

        const items = [
            {
                title: 'THE NIGHT ARCHIVE',
                description: 'Explore the nocturnal elegance of our new silk and Egyptian cotton collection.',
                backgroundImage: '/uploads/carousel1.png',
                link: '/shop?segment=men',
                order: 1
            },
            {
                title: 'SEASONAL ACQUISITIONS',
                description: 'The Diamond Clearance is here. Discover luxury pieces with up to 50% appreciation value.',
                backgroundImage: '/uploads/carousel2.png',
                link: '/shop',
                order: 2
            },
            {
                title: 'DIAMOND ELITE REWARDS',
                description: 'Join the Maison membership to unlock exclusive early access and private concierge services.',
                backgroundImage: '/uploads/carousel3.png',
                link: '/profile',
                order: 3
            }
        ];

        await CarouselItem.insertMany(items);
        console.log('Carousel seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
