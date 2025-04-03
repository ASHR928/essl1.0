const { DataTypes, Sequelize } = require('sequelize');
const db = require('../../sequelizeconn'); // Adjust the path as needed

const RosterRequest = db.define("ROSTER_REQUEST", {
  Request_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  RM_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
 
  },
  TL_ID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Manager_ID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Roster_File_Path: {
    type: DataTypes.BLOB('long'), // Store the file as binary data
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
    validate: {
      isIn: [['Pending', 'Approved', 'Rejected']],
    },
  },
  Comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Created_At: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.DATE.NOW,
  },
  Updated_At: {
    type: Sequelize.DATE,
    allowNull: true,
  },
}, {
  timestamps: false, // Disable Sequelize's automatic timestamps
  tableName: 'ROSTER_REQUEST', // Explicitly set the table name
});

module.exports = RosterRequest;