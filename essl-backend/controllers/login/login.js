const { DataTypes,Sequelize } = require('sequelize');
const db = require("../../sequelizeconn");

const UserMaster = db.define('USER_MASTER', {
    User_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Emp_ID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Role_ID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Created_At: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    Updated_At: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    Updated_By_UserID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:'101'
    }
}, {
    tableName: 'USER_MASTER',
    timestamps: false // Disable Sequelize's automatic timestamps
});

module.exports = UserMaster;
