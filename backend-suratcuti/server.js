require('dotenv').config();
const app = require('./src/app'); // Menggunakan app dari file terpisah
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3010;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

// Menangani graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
    console.log('Database connection closed.');
});

startServer(); 