const { DataTypes } = require('sequelize');
const db = require('../../sequelizeconn');

const ApplicationLog = db.define('ApplicationLogs', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
  },
  action_screen: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
  tableName: 'ApplicationLogs',
});

module.exports = ApplicationLog;