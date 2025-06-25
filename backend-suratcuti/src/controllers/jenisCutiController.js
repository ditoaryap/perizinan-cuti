const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllJenisCuti = async (req, res) => {
    try {
        const jenisCuti = await prisma.jenisCuti.findMany();
        res.json({ success: true, data: jenisCuti });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const createJenisCuti = async (req, res) => {
    try {
        const { nama, maxHari } = req.body;
        const newJenisCuti = await prisma.jenisCuti.create({
            data: { nama, maxHari },
        });
        res.status(201).json({ success: true, message: 'Jenis Cuti created successfully', data: newJenisCuti });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, message: `Jenis Cuti dengan nama '${req.body.nama}' sudah ada.` });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const updateJenisCuti = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, maxHari } = req.body;
        const updatedJenisCuti = await prisma.jenisCuti.update({
            where: { id: parseInt(id) },
            data: { nama, maxHari },
        });
        res.json({ success: true, message: 'Jenis Cuti updated successfully', data: updatedJenisCuti });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Jenis Cuti not found' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const deleteJenisCuti = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.jenisCuti.delete({
            where: { id: parseInt(id) },
        });
        res.json({ success: true, message: 'Jenis Cuti deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Jenis Cuti not found' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllJenisCuti,
    createJenisCuti,
    updateJenisCuti,
    deleteJenisCuti,
}; 