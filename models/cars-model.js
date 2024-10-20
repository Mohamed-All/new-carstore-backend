const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    km: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    img: [{ type: String, required: true }], 
    description: { type: String, required: false },
    type: { type: String, required: true }
});


const Car = mongoose.model('Car', carSchema);

module.exports = Car;
