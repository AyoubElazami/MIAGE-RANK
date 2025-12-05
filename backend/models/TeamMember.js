const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const TeamMember = sequelize.define("TeamMember", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    role: {
        type: DataTypes.ENUM('leader', 'member'),
        defaultValue: 'member',
        allowNull: false,
    },
    joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    timestamps: true,
    indexes: [
        { fields: ['TeamId'] },
        { fields: ['UserId'] },
        { fields: ['role'] }
    ]
});
module.exports = TeamMember;