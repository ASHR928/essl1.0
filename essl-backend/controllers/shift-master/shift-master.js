const { DataTypes, Sequelize } = require('sequelize');
const db = require('../../sequelizeconn');

const ShiftMaster = db.define("SHIFT_MASTER", {
  Shift_ID: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  Shift_StartTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  Shift_EndTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  Is_Approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  Approved_By: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Is_Active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: false,
  tableName: 'SHIFT_MASTER',
});

module.exports = ShiftMaster;