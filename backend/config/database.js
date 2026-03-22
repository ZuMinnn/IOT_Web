require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'iot_dashboard',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host:    process.env.DB_HOST || 'localhost',
        port:    parseInt(process.env.DB_PORT) || 3306,
        dialect: 'mariadb',
        logging: false, // Tắt log SQL (bật lại khi debug: console.log)
        pool: {
            max:     10,
            min:     0,
            acquire: 30000,
            idle:    10000,
        },
        define: {
            timestamps:  false, // Tắt auto createdAt/updatedAt của Sequelize (ta tự quản)
            underscored: false,
        },
        timezone: '+07:00', // Múi giờ Việt Nam
    }
);

module.exports = sequelize;
