const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');

const getAllCutiRequests = async (req, res) => {
    try {
        const { id, role } = req.user;
        const { status, page = 1, limit = 10 } = req.query;

        const where = {};
        if (role === 'pegawai') {
            where.userId = id;
        } else if (role !== 'admin') {
            // If role is not admin or pegawai, return empty
            return res.json({ success: true, data: [], pagination: { total: 0, page: 1, limit: parseInt(limit), totalPages: 0 } });
        }

        if (status) {
            where.status = status;
        }

        const cutiRequests = await prisma.cutiRequest.findMany({
            where,
            include: {
                user: { select: { nama: true } },
                jenisCuti: { select: { nama: true } },
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.cutiRequest.count({ where });

        res.json({
            success: true,
            data: cutiRequests,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const getCutiRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const cutiRequest = await prisma.cutiRequest.findUnique({
            where: { id: parseInt(id) },
            include: { user: { select: { nama: true, email: true } }, jenisCuti: true },
        });

        if (!cutiRequest) {
            return res.status(404).json({ success: false, message: 'Cuti request not found' });
        }

        if (req.user.role === 'pegawai' && req.user.id !== cutiRequest.userId) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        res.json({ success: true, data: cutiRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const createCutiRequest = async (req, res) => {
    const { jenisCutiId, tanggalMulai, tanggalSelesai, alasan } = req.body;
    const userId = req.user.id;

    if (!jenisCutiId) {
        return res.status(400).json({ success: false, message: 'Jenis Cuti harus dipilih.' });
    }

    const parsedJenisCutiId = parseInt(jenisCutiId, 10);
    const tahun = new Date(tanggalMulai).getFullYear();

    try {
        const startDate = new Date(tanggalMulai);
        const endDate = new Date(tanggalSelesai);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ success: false, message: 'Format tanggal tidak valid.' });
        }

        const requestedDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        let kuotaCuti = await prisma.kuotaCuti.findFirst({
            where: { userId, jenisCutiId: parsedJenisCutiId, tahun },
        });

        // If kuota does not exist, create it on-the-fly
        if (!kuotaCuti) {
            const jenisCutiInfo = await prisma.jenisCuti.findUnique({ where: { id: parsedJenisCutiId } });
            if (!jenisCutiInfo) {
                return res.status(400).json({ success: false, message: 'Jenis cuti tidak valid.' });
            }
            kuotaCuti = await prisma.kuotaCuti.create({
                data: {
                    userId,
                    jenisCutiId: parsedJenisCutiId,
                    tahun,
                    totalKuota: jenisCutiInfo.maxHari,
                    sisaKuota: jenisCutiInfo.maxHari,
                }
            });
        }

        if (kuotaCuti.sisaKuota < requestedDays) {
            return res.status(400).json({ success: false, message: `Sisa kuota tidak mencukupi. Sisa kuota Anda untuk jenis cuti ini adalah ${kuotaCuti.sisaKuota} hari.` });
        }

        const newCutiRequest = await prisma.cutiRequest.create({
            data: {
                userId,
                jenisCutiId: parsedJenisCutiId,
                tanggalMulai: startDate,
                tanggalSelesai: endDate,
                alasan
            },
        });
        res.status(201).json({ success: true, message: 'Cuti request created successfully', data: newCutiRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const updateCutiStatus = async (req, res, newStatus) => {
    const { id } = req.params;
    const adminId = req.user.id;

    try {
        const cutiRequest = await prisma.cutiRequest.findUnique({ where: { id: parseInt(id) } });

        if (!cutiRequest || cutiRequest.status !== 'DIAJUKAN') {
            return res.status(400).json({ success: false, message: 'Request tidak valid atau sudah diproses' });
        }

        if (newStatus === 'DISETUJUI') {
            const requestedDays = Math.ceil(Math.abs(cutiRequest.tanggalSelesai - cutiRequest.tanggalMulai) / (1000 * 60 * 60 * 24)) + 1;
            const tahun = cutiRequest.tanggalMulai.getFullYear();

            await prisma.$transaction(async (tx) => {
                const kuota = await tx.kuotaCuti.findFirst({ where: { userId: cutiRequest.userId, jenisCutiId: cutiRequest.jenisCutiId, tahun } });
                if (!kuota || kuota.sisaKuota < requestedDays) throw new Error("Kuota tidak cukup.");

                await tx.kuotaCuti.update({
                    where: { id: kuota.id },
                    data: { sisaKuota: kuota.sisaKuota - requestedDays }
                });

                await tx.cutiRequest.update({
                    where: { id: parseInt(id) },
                    data: { status: 'DISETUJUI', approvedAt: new Date(), approvedBy: adminId }
                });
            });
            return res.json({ success: true, message: 'Cuti request approved' });
        } else { // DITOLAK
            await prisma.cutiRequest.update({
                where: { id: parseInt(id) },
                data: { status: 'DITOLAK', approvedAt: new Date(), approvedBy: adminId },
            });
            return res.json({ success: true, message: 'Cuti request rejected' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

const approveCutiRequest = (req, res) => updateCutiStatus(req, res, 'DISETUJUI');
const rejectCutiRequest = (req, res) => updateCutiStatus(req, res, 'DITOLAK');

const downloadCutiPdf = async (req, res) => {
    try {
        const { id } = req.params;
        const cutiRequest = await prisma.cutiRequest.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: true, // Fetch full user
                jenisCuti: true, // Fetch full jenisCuti
            },
        });

        if (!cutiRequest || cutiRequest.status !== 'DISETUJUI') {
            return res.status(404).json({ success: false, message: 'Surat Cuti tidak ditemukan atau belum disetujui.' });
        }

        const approvingAdmin = await prisma.user.findUnique({ where: { id: cutiRequest.approvedBy } });

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const filename = `surat-cuti-${cutiRequest.user.nama.replace(/\s+/g, '-')}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // --- Document Content ---
        doc.fontSize(14).font('Helvetica-Bold').text('FORMULIR PERMINTAAN DAN PEMBERIAN CUTI', { align: 'center' });
        doc.moveDown();

        // Section I: Data Pegawai
        doc.font('Helvetica-Bold').text('I. DATA PEGAWAI');
        doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        const employeeData = {
            'Nama': cutiRequest.user.nama,
            'NIP': cutiRequest.user.nip || '-',
            'Jabatan': cutiRequest.user.jabatan || '-',
        };
        for (const [label, value] of Object.entries(employeeData)) {
            doc.font('Helvetica').fontSize(10).text(`${label}: ${value}`);
        }
        doc.moveDown();

        // Section II: Jenis Cuti
        doc.font('Helvetica-Bold').text('II. JENIS CUTI YANG DIAMBIL');
        doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).text(cutiRequest.jenisCuti.nama);
        doc.moveDown();

        // Section III: Alasan Cuti
        doc.font('Helvetica-Bold').text('III. ALASAN CUTI');
        doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).text(cutiRequest.alasan);
        doc.moveDown();

        // Section IV: Lamanya Cuti
        const startDate = new Date(cutiRequest.tanggalMulai);
        const endDate = new Date(cutiRequest.tanggalSelesai);
        const duration = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        doc.font('Helvetica-Bold').text('IV. LAMANYA CUTI');
        doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).text(`Selama ${duration} hari, dari tanggal ${startDate.toLocaleDateString('id-ID')} s.d. ${endDate.toLocaleDateString('id-ID')}`);
        doc.moveDown(2);

        // Signatures
        const signatureY = doc.y > 600 ? doc.y + 30 : 600;
        const leftX = 50;
        const rightX = 350;

        doc.fontSize(11).font('Helvetica');

        // Approver (Left Side) - Atasan yang Menyetujui
        doc.text('Mengetahui dan Menyetujui,', leftX, signatureY);
        doc.text(approvingAdmin ? approvingAdmin.jabatan || 'Atasan Langsung' : 'Atasan Langsung', leftX, signatureY + 15);
        doc.moveTo(leftX, signatureY + 85).lineTo(leftX + 160, signatureY + 85).stroke(); // Signature line
        doc.font('Helvetica-Bold').text(approvingAdmin ? approvingAdmin.nama : 'Nama Atasan', leftX, signatureY + 95);
        doc.font('Helvetica').text(approvingAdmin ? `NIP. ${approvingAdmin.nip}` : 'NIP.', leftX, signatureY + 110);


        // Requester (Right Side) - Pegawai yang Mengajukan
        doc.text(`Jakarta, ${new Date(cutiRequest.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, rightX, signatureY);
        doc.text('Hormat saya,', rightX, signatureY + 15);
        doc.moveTo(rightX, signatureY + 85).lineTo(rightX + 160, signatureY + 85).stroke(); // Signature line
        doc.font('Helvetica-Bold').text(cutiRequest.user.nama, rightX, signatureY + 95);
        doc.font('Helvetica').text(`NIP. ${cutiRequest.user.nip}`, rightX, signatureY + 110);

        doc.end();

    } catch (error) {
        console.log(error); // Log error for debugging
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

module.exports = {
    getAllCutiRequests,
    getCutiRequestById,
    createCutiRequest,
    approveCutiRequest,
    rejectCutiRequest,
    downloadCutiPdf,
}; 