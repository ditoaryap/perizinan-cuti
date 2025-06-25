const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    // Try to get the token from cookies first, then fall back to Authorization header
    let token = req.cookies.token;

    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak. Silakan login terlebih dahulu.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the full user from the database to ensure data is fresh
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Pengguna tidak ditemukan.' });
        }

        // Attach the full user object to the request
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid atau sesi telah berakhir.',
            error: error.message,
        });
    }
};

module.exports = authMiddleware; 