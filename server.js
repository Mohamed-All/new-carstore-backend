const mongoose = require('mongoose');
const express = require('express');
// const carRoutes = require('./routes/car-routes'); 
const carRoutes = require('./routes/cars-routes')
const authRoutes = require('./routes/auth')
const someObject = { key: 'value' }; 
mongoose.connect('mongodb+srv://mohamedali76544321:0YNmnpsjTrKsuNVj@cars.7a20z.mongodb.net/?retryWrites=true&w=majority&appName=Cars')
    .then(() => console.log('Connected to Database'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const expressApp = express();
expressApp.use(express.json());

expressApp.get('/', (req, res) => {
  res.send('Hello World!'); 
});
expressApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
      return res.status(200).json({});
    }
    next();
  });

expressApp.use('/cars',carRoutes)
expressApp.use('/api/auth', authRoutes);
console.log(JSON.stringify(someObject, null, 2))
expressApp.listen(3000, () => console.log('Server is running on port 3000'));
