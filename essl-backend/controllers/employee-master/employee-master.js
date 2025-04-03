const { DataTypes, Sequelize } = require('sequelize');
const db = require('../../sequelizeconn');

const EmployeeMaster = db.define('EMPLOYEE_MASTER', {
  Emp_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Emp_Company_ID: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, // Add unique constraint for foreign key reference
  },
  Emp_Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Emp_Alias_Name: {
    type: DataTypes.STRING,
  },
  Emp_Company: {
    type: DataTypes.STRING,
  },
  Emp_Designation: {
    type: DataTypes.STRING,
  },
  Emp_Contact_No: {
    type: DataTypes.STRING,
  },
  Emp_email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  Emp_Team_Name: {
    type: DataTypes.STRING,
  },
  Emp_Location: {
    type: DataTypes.STRING,
  },
  Emp_DOJ: {
    type: DataTypes.DATEONLY,
  },
  Emp_DOB: {
    type: DataTypes.DATEONLY,
  },
  Emp_Department_Name: {
    type: DataTypes.STRING,
  },
  PAN_Number: {
    type: DataTypes.STRING,
  },
  UAN_Number: {
    type: DataTypes.STRING,
  },
  ESIC_Number: {
    type: DataTypes.STRING,
  },
  Aadhar_no: {
    type: DataTypes.STRING,
  },
  Is_Active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  Created_At: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.DATE.NOW,
  },
  Updated_At: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.DATE.NOW,
  },
}, {
  tableName: 'EMPLOYEE_MASTER',
  timestamps: false,
});

// Define the association with ROSTER_MASTER


module.exports = EmployeeMaster;