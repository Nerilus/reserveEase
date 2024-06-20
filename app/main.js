const express = require("express");
const sequelize = require("./config/database");
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const hotelRoutes = require('./routes/hotelRoutes');

const app = express();
require('dotenv').config();



app.use(express.json());

app.use('/api/hotels', hotelRoutes)



sequelize.sync({ force: true }) 
  .then(() => {
    app.listen(8000, () => {
      console.log('Server is running on port 8000');
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });