const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Handler untuk registrasi user baru
const register = async (req, res) => {
    const { email, password, nama, role, nip, jabatan } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                nama,
                role: role || 'pegawai',
                nip,
                jabatan,
            },
        });
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({
            success: true,
            message: 'User berhasil ditambahkan',
            data: userWithoutPassword,
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ success: false, message: 'Email atau NIP sudah terdaftar.' });
        }
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

// Handler untuk login user
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { nip: email }
                ]
            },
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Email/NIP atau password salah' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Email/NIP atau password salah' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, // Frontend depends on 'id'
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login berhasil',
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

// Handler untuk mendapatkan profil user
const getProfile = async (req, res) => {
    try {
        // req.user dilampirkan dari authMiddleware
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, data: userWithoutPassword });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile
}; 