const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Challenge = sequelize.define("Challenge", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['technique', 'creativite', 'collaboration', 'innovation', 'autre']]
        }
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: {
            min: 1,
            max: 2000
        }
    },
    difficulty: {
        type: DataTypes.ENUM('facile', 'moyen', 'difficile', 'expert'),
        allowNull: false,
        defaultValue: 'moyen',
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    maxTeams: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1
        }
    },
    requirements: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
}, {
    timestamps: true,
    indexes: [
        { fields: ['isActive'] },
        { fields: ['category'] },
        { fields: ['startDate', 'endDate'] },
        { fields: ['createdBy'] }
    ]
});
module.exports = Challenge;