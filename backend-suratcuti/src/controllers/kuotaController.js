const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getKuotaCuti = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const tahun = new Date().getFullYear();

        const kuota = await prisma.kuotaCuti.findMany({
            where: { userId, tahun },
        });

        if (kuota.length === 0) {
            return res.json({
                success: true,
                data: { total: 0, terpakai: 0, sisa: 0 }
            });
        }

        const total = kuota.reduce((acc, k) => acc + k.totalKuota, 0);
        const sisa = kuota.reduce((acc, k) => acc + k.sisaKuota, 0);

        res.json({
            success: true,
            data: {
                total,
                terpakai: total - sisa,
                sisa,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const createKuotaCuti = async (req, res) => {
    try {
        const { userId, jenisCutiId, tahun, totalKuota } = req.body;
        const newKuota = await prisma.kuotaCuti.create({
            data: {
                userId,
                jenisCutiId,
                tahun,
                totalKuota,
                sisaKuota: totalKuota,
            },
        });
        res.status(201).json({ success: true, message: 'Kuota Cuti created successfully', data: newKuota });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, message: `Kuota cuti untuk user, tipe, dan tahun ini sudah ada.` });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const updateKuotaCuti = async (req, res) => {
    try {
        const { id } = req.params;
        const { totalKuota, sisaKuota } = req.body;
        const updatedKuota = await prisma.kuotaCuti.update({
            where: { id: parseInt(id) },
            data: { totalKuota, sisaKuota },
                });
        res.json({ success: true, message: 'Kuota Cuti updated successfully', data: updatedKuota });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Kuota Cuti not found' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getKuotaCuti,
    createKuotaCuti,
    updateKuotaCuti,
}; 