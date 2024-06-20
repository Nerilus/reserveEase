const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  rating: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 5
    }
  },
  rooms: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  cheapest_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'hotels',
  timestamps: true
});

module.exports = Hotel;
