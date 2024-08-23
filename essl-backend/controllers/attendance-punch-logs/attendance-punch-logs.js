const { DataTypes } = require('sequelize');
const db = require('../../sequelizeconn');

const AttendanceLog = db.define('AttendanceLog', {
  AttendanceLogId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  AttendanceDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  EmployeeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  InTime: {
    type: DataTypes.TIME,
  },
  InDeviceId: {
    type: DataTypes.INTEGER,
  },
  OutTime: {
    type: DataTypes.TIME,
  },
  OutDeviceId: {
    type: DataTypes.INTEGER,
  },
  Duration: {
    type: DataTypes.INTEGER,
  },
  LateBy: {
    type: DataTypes.INTEGER,
  },
  EarlyBy: {
    type: DataTypes.INTEGER,
  },
  IsOnLeave: {
    type: DataTypes.BOOLEAN,
  },
  LeaveType: {
    type: DataTypes.STRING,
  },
  LeaveDuration: {
    type: DataTypes.INTEGER,
  },
  WeeklyOff: {
    type: DataTypes.INTEGER,
  },
  Holiday: {
    type: DataTypes.INTEGER,
  },
  LeaveRemarks: {
    type: DataTypes.STRING,
  },
  PunchRecords: {
    type: DataTypes.TEXT,
  },
  ShiftId: {
    type: DataTypes.INTEGER,
  },
  Present: {
    type: DataTypes.BOOLEAN,
  },
  Absent: {
    type: DataTypes.BOOLEAN,
  },
  Status: {
    type: DataTypes.STRING,
  },
  StatusCode: {
    type: DataTypes.STRING,
  },
  P1Status: {
    type: DataTypes.STRING,
  },
  P2Status: {
    type: DataTypes.STRING,
  },
  P3Status: {
    type: DataTypes.STRING,
  },
  IsonSpecialOff: {
    type: DataTypes.INTEGER,
  },
  SpecialOffType: {
    type: DataTypes.STRING,
  },
  SpecialOffRemark: {
    type: DataTypes.STRING,
  },
  SpecialOffDuration: {
    type: DataTypes.INTEGER,
  },
  OverTime: {
    type: DataTypes.INTEGER,
  },
  OverTimeE: {
    type: DataTypes.INTEGER,
  },
  MissedOutPunch: {
    type: DataTypes.INTEGER,
  },
  Remarks: {
    type: DataTypes.STRING,
  },
  MissedInPunch: {
    type: DataTypes.INTEGER,
  },
  C1: {
    type: DataTypes.STRING,
  },
  C2: {
    type: DataTypes.STRING,
  },
  C3: {
    type: DataTypes.STRING,
  },
  C4: {
    type: DataTypes.STRING,
  },
  C5: {
    type: DataTypes.STRING,
  },
  C6: {
    type: DataTypes.STRING,
  },
  C7: {
    type: DataTypes.STRING,
  },
  LeaveTypeId: {
    type: DataTypes.INTEGER,
  },
  LossOfHours: {
    type: DataTypes.INTEGER,
  }
}, {
  timestamps: false,
  tableName: 'AttendanceLogs'
});

module.exports = AttendanceLog;
