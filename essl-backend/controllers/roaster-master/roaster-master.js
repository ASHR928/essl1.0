const { DataTypes, Sequelize } = require('sequelize');
const db = require('../../sequelizeconn');

const RosterMaster = db.define('ROSTER_MASTER', {
  RM_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Emp_ID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Weekly_Off1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Weekly_Off2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Shift_ID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Created_At: {
    type: Sequelize.DATE,
    allowNull: true,
    defaultValue: Sequelize.DATE.NOW,
  },
  Updated_At: {
    type: Sequelize.DATE,
    allowNull: true,
    defaultValue: Sequelize.DATE.NOW,
  },
  Status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  Start_Date: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  End_Date: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  Updated_By_UserID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'ROSTER_MASTER',
  timestamps: false,
});

// Define the association with EMPLOYEE_MASTER

module.exports = RosterMaster;