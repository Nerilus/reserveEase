const express = require("express");
const sequelize = require("./config/database");
const hotelRoutes = require('./routes/hotelRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const morgan = require('morgan'); // Importez morgan


const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(morgan('combined')); 
app.use(express.json());

app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/room', roomRoutes);



app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

sequelize.sync({ force: false })
  .then(() => {
    app.listen(8000, () => {
      console.log('Server is running on port 8000');
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});
