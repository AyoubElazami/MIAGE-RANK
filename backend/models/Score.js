const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Score = sequelize.define("Score", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    bonus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    totalPoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('pending', 'validated', 'rejected'),
        defaultValue: 'pending',
        allowNull: false,
    },
    validatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    validatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    workSubmission: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Lien vers le travail soumis (GitHub, Drive, etc.) ou description'
    },
    workFiles: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'URLs des fichiers uploadés'
    },
}, {
    timestamps: true,
    indexes: [
        { fields: ['status'] },
        { fields: ['totalPoints'] },
        { fields: ['TeamId'] },
        { fields: ['ChallengeId'] }
    ]
});

// La synchronisation se fait dans models/index.js pour respecter l'ordre des dépendances

module.exports = Score;

