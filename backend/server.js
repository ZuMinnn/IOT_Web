require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const sensorRoutes = require('./routes/sensorRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/v1/sensors', sensorRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use(errorHandler);

async function start() {
    await sequelize.authenticate();
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(err => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
});
