const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CarouselItem = require('../models/CarouselItem');
const { auth, isAdmin } = require('../middleware/auth');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, 'carousel-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Get all active items
router.get('/', async (req, res) => {
    try {
        const items = await CarouselItem.find({ isActive: true }).sort('order');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all items
router.get('/admin', auth, isAdmin, async (req, res) => {
    try {
        const items = await CarouselItem.find().sort('order');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Add item with image
router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, description, link, order, isActive } = req.body;
        const backgroundImage = req.file ? `/uploads/${req.file.filename}` : '';

        const newItem = new CarouselItem({
            title,
            description,
            backgroundImage,
            link,
            order: Number(order || 0),
            isActive: isActive === 'true'
        });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update item
router.put('/:id', auth, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.backgroundImage = `/uploads/${req.file.filename}`;
        }
        if (updates.isActive !== undefined) updates.isActive = updates.isActive === 'true';
        if (updates.order !== undefined) updates.order = Number(updates.order);

        const item = await CarouselItem.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Delete item
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        await CarouselItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Carousel item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
