const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile (comprehensive)
router.put('/profile', auth, async (req, res) => {
    try {
        const {
            mobile, gender, dob, location,
            alternateMobile, hintName, address
        } = req.body;

        const user = await User.findById(req.user.id);

        if (mobile !== undefined) user.mobile = mobile;
        if (gender !== undefined) user.gender = gender;
        if (dob !== undefined) user.dob = dob;
        if (location !== undefined) user.location = location;
        if (alternateMobile !== undefined) user.alternateMobile = alternateMobile;
        if (hintName !== undefined) user.hintName = hintName;

        if (address) {
            user.address = {
                fullName: address.fullName || user.address.fullName,
                mobile: address.mobile || user.address.mobile,
                pincode: address.pincode || user.address.pincode,
                addressLine: address.addressLine || user.address.addressLine,
                locality: address.locality || user.address.locality,
                city: address.city || user.address.city,
                state: address.state || user.address.state,
                landmark: address.landmark || user.address.landmark,
                addressType: address.addressType || user.address.addressType
            };
        }

        await user.save();
        const updatedUser = await User.findById(req.user.id).select('-password');
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle wishlist
router.post('/wishlist/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.productId;

        const index = user.wishlist.indexOf(productId);
        if (index === -1) {
            user.wishlist.push(productId);
        } else {
            user.wishlist.splice(index, 1);
        }

        await user.save();
        res.json({ message: 'Wishlist updated', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin notify all users
router.post('/notify-all', auth, isAdmin, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        await User.updateMany({}, {
            $push: { notifications: { $each: [{ message }], $position: 0 } }
        });

        res.json({ message: 'Notifications sent to all users' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
