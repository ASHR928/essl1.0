const { DataTypes,Sequelize } = require('sequelize');
const db = require('../../sequelizeconn');


const DisputeRequest = db.define("DISPUTE_REQUESTS",{

  DisputeId:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  AttendanceDate :{
    type: Sequelize.DATE,
    allowNull: false
  },
  EmployeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
  Current_status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Absent', 'Casual Leave', 'SW', 'OT', 'NCNS', 'Sick Leave', 'Present']],
    },
  },
  Requested_status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Absent', 'Casual Leave', 'SW', 'OT', 'NCNS', 'Sick Leave', 'Present']],
    },
  },
  Reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
    validate: {
      isIn: [['Pending', 'Approved', 'Rejected']],
    },
  },
  Manager_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
 CreatedAt : {
    type: Sequelize.DATE,
    defaultValue: Sequelize.DATE.NOW,
 },
},{
    timestamps: false,
  tableName: 'DISPUTE_REQUESTS',




})

module.exports = DisputeRequest