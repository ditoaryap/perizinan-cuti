const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const bcrypt = require('bcryptjs');

// Endpoint untuk pegawai mengganti password sendiri (hanya butuh login)
router.put('/password', authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Password lama salah' });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ success: false, message: 'Password baru harus berbeda dengan password lama.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        res.json({ success: true, message: 'Password berhasil diubah' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengubah password', error: error.message });
    }
});

// Admin only
router.use(authMiddleware, authorize('admin'));

// Get all users (pegawai)
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            // where: { role: 'pegawai' }, // We want to see all users, including admins
            select: { id: true, nama: true, email: true, nip: true, jabatan: true, role: true } // FIX: Add role to the selection
        });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    const { email, password, nama, role, nip, jabatan } = req.body;
    try {
        const hashedPassword = await require('bcryptjs').hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, nama, role, nip, jabatan },
        });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Gagal membuat user', error: error.message });
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { email, password, nama, role, nip, jabatan } = req.body;
    try {
        const updateData = { email, nama, role, nip, jabatan };
        if (password) {
            updateData.password = await require('bcryptjs').hash(password, 10);
        }
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Gagal update user', error: error.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.json({ success: true, message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Gagal menghapus user', error: error.message });
    }
});

module.exports = router; 