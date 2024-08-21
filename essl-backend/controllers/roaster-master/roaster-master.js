const { DataTypes } = require('sequelize');
const db = require('../../sequelizeconn');

const RosterMaster = db.define('Roster_Master', {
  RM_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Emp_ID: {
    type: DataTypes.INTEGER,
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
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  Updated_At: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,

  },
  Start_Date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  End_Date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  Updated_By_UserID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'ROSTER_MASTER',
  timestamps: false, 
});

module.exports = RosterMaster;
