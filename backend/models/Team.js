const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Team = sequelize.define("Team", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [2, 50]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "#3B82F6", // Bleu par défaut
        validate: {
            is: /^#[0-9A-F]{6}$/i
        }
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    totalScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    rank: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
}, {
    timestamps: true,
    indexes: [
        { fields: ['totalScore'] },
        { fields: ['isActive'] }
        // Retiré l'index sur 'rank' pour réduire le nombre d'index
    ]
});

// La synchronisation se fait dans models/index.js pour respecter l'ordre des dépendances

module.exports = Team;

