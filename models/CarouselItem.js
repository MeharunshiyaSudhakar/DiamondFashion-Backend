const mongoose = require('mongoose');

const carouselItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    backgroundImage: { type: String, required: true }, // URL to image
    link: { type: String, default: '/shop' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CarouselItem', carouselItemSchema);
