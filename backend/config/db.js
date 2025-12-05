const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: parseInt(process.env.DB_PORT) || 3306,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);
sequelize.authenticate()
    .then(() => {
        console.log("✅ Connexion à la base de données MySQL réussie!");
    })
    .catch((err) => {
        console.error("❌ Erreur de connexion à la base de données:", err);
    });
module.exports = sequelize;