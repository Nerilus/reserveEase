const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 5,
    },
  },
  cheapest_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
}, {
  tableName: 'hotels',
  timestamps: true,
});

module.exports = Hotel;
