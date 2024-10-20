const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Car = require('../models/cars-model');

const router = express.Router();

// إعداد Cloudinary
cloudinary.config({
    cloud_name: 'duwd46afm',
    api_key: '716694817629873',
    api_secret: '9T7JwOP5Ujy6XpIRhunhNWsoFas'
});

// إعداد تخزين Cloudinary باستخدام multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {

        allowedFormats: ['jpg', 'png', 'jpeg'],
    },
});

// إعداد Multer
const upload = multer({ storage: storage });

// نقطة نهاية لتحميل الصورة وإضافة سيارة جديدة
router.post('/add', upload.array('img', 10), async (req, res) => { // 'img' هو اسم الحقل
    try {
        const newCar = new Car({
            ...req.body,
            img: req.files.map(file => file.path) // تخزين مسارات الصور
        });
        await newCar.save();
        res.status(201).json({ message: 'Car added successfully', car: newCar });
    } catch (error) {
        console.error('Error adding car:', error);
        res.status(500).json({ message: 'Error adding car', error });
    }
});

// نقطة نهاية لجلب سيارة معينة (GET)
router.get('/one/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id); // البحث عن السيارة بواسطة ID
        if (!car) {
            return res.status(404).json({ message: 'Car not found' }); // إذا لم يتم العثور على السيارة
        }
        res.status(200).json(car); // إرجاع السيارة في شكل JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching car', error }); // معالجة الأخطاء
    }
});

// نقطة نهاية لجلب جميع السيارات (GET)
router.get('/all', async (req, res) => {
    try {
        const cars = await Car.find(); // جلب جميع السيارات من قاعدة البيانات
        res.status(200).json(cars); // إرجاع السيارات في شكل JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error }); // معالجة الأخطاء
    }
});

// نقطة نهاية لتحديث سيارة (PUT)
router.put('/:id', upload.array('img', 10), async (req, res) => {
    try {
        const updatedData = {
            name: req.body.name,
            brand: req.body.brand,
            model: req.body.model,
            km: req.body.km,
            price: req.body.price,
            location: req.body.location,
            description: req.body.description,
            type: req.body.type,
        };

        if (req.files) {
            updatedData.img = req.files.map(file => file.path); // تحديث الصور إذا تم تحميل صور جديدة
        }

        const car = await Car.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car updated successfully!', car });
    } catch (error) {
        res.status(500).json({ message: 'Error updating car', error });
    }
});

// نقطة نهاية لحذف سيارة (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting car', error });
    }
});

module.exports = router;
