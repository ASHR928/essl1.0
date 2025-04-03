const { DataTypes,Sequelize } = require('sequelize');
const db = require('../../sequelizeconn');


const LeaveRequest = db.define("LEAVE_REQUEST",{

 LeaveEntryId:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true,
    allowNull: false
 },
 LeaveTypeId:{
    type: DataTypes.INTEGER,
    allowNull: false
 },
 FromDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ToDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  LeaveStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  IsApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ApprovedBy_UserID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ApprovedBy_EmpID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CreatedDate : {
    type: Sequelize.DATE,
    defaultValue: Sequelize.DATE.NOW,
 },
  Employee_Id: {
    type: DataTypes.STRING,
    allowNull: true
  },
 
 
},
{
    timestamps: false,
    tableName: 'LEAVE_REQUEST',
}

)

module.exports = LeaveRequest;