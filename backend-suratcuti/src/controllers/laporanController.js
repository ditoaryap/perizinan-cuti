const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
const prisma = new PrismaClient();

const getLaporan = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;

        if (!bulan || !tahun) {
            return res.status(400).json({ success: false, message: 'Parameter bulan dan tahun diperlukan' });
        }

        const startDate = new Date(tahun, bulan - 1, 1);
        const endDate = new Date(tahun, bulan, 0, 23, 59, 59);

        const where = {
            createdAt: { gte: startDate, lte: endDate },
        };

        let requests = [];
        try {
            requests = await prisma.cutiRequest.findMany({
                where,
                include: {
                    user: { select: { nama: true } },
                    jenisCuti: { select: { nama: true } }
                },
                orderBy: { createdAt: 'asc' }
            });
        } catch (err) {
            console.error('Error fetching cutiRequest:', err);
        }

        const jumlah_pengajuan = requests.length;
        const disetujui = requests.filter(r => r.status === 'DISETUJUI').length;
        const ditolak = requests.filter(r => r.status === 'DITOLAK').length;
        const diajukan = requests.filter(r => r.status === 'DIAJUKAN').length;

        let totalPegawai = 0;
        let totalJenisCuti = 0;
        try {
            totalPegawai = await prisma.user.count({ where: { role: { in: ['pegawai', 'PEGAWAI', 'admin', 'ADMIN'] } } });
            totalJenisCuti = await prisma.jenisCuti.count();
        } catch (err) {
            console.error('Error counting user/jenisCuti:', err);
        }

        let jenisCutiTerbanyak = null;
        try {
            const cutiTerbanyak = await prisma.cutiRequest.groupBy({
                by: ['jenisCutiId'],
                where,
                _count: { jenisCutiId: true },
                orderBy: { _count: { jenisCutiId: 'desc' } },
                take: 1,
            });
            if (cutiTerbanyak.length > 0 && cutiTerbanyak[0].jenisCutiId) {
                const jenisCuti = await prisma.jenisCuti.findUnique({
                    where: { id: cutiTerbanyak[0].jenisCutiId }
                });
                if (jenisCuti) {
                    jenisCutiTerbanyak = {
                        nama: jenisCuti.nama,
                        total: cutiTerbanyak[0]._count.jenisCutiId,
                    }
                }
            }
        } catch (err) {
            console.error('Error groupBy jenisCuti:', err);
        }

        res.json({
            success: true,
            data: {
                periode: { bulan, tahun },
                jumlah_pengajuan,
                disetujui,
                ditolak,
                diajukan,
                cuti_terbanyak: jenisCutiTerbanyak,
                total_pegawai: totalPegawai,
                total_jenis_cuti: totalJenisCuti,
            },
        });
    } catch (error) {
        console.error('Unexpected error in getLaporan:', error);
        res.status(200).json({
            success: true,
            data: {
                periode: { bulan: req.query.bulan, tahun: req.query.tahun },
                jumlah_pengajuan: 0,
                disetujui: 0,
                ditolak: 0,
                diajukan: 0,
                cuti_terbanyak: null,
                total_pegawai: 0,
                total_jenis_cuti: 0,
            },
            error: error.message
        });
    }
};

// Frontend mungkin butuh data statistik untuk dashboard
const getDashboardStats = async (req, res) => {
    try {
        const totalPegawai = await prisma.user.count({ where: { role: 'pegawai' } });
        const totalPengajuan = await prisma.cutiRequest.count({ where: { status: 'DIAJUKAN' } });
        const totalCutiBulanIni = await prisma.cutiRequest.count({
            where: {
                status: 'DISETUJUI',
                tanggalMulai: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                }
            }
        });

        res.json({
            success: true,
            data: {
                totalPegawai,
                totalPengajuan,
                totalCutiBulanIni
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

const downloadLaporanPdf = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;
        if (!bulan || !tahun) {
            return res.status(400).send('Parameter bulan dan tahun diperlukan');
        }

        const startDate = new Date(tahun, bulan - 1, 1);
        const endDate = new Date(tahun, bulan, 0, 23, 59, 59);
        const where = { createdAt: { gte: startDate, lte: endDate } };

        const requests = await prisma.cutiRequest.findMany({
            where,
            include: {
                user: { select: { nama: true } },
                jenisCuti: { select: { nama: true } }
            },
            orderBy: { createdAt: 'asc' }
        });

        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });
        const monthName = startDate.toLocaleString('id-ID', { month: 'long' });
        const filename = `laporan-cuti-${monthName}-${tahun}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        // Header
        doc.fontSize(16).font('Helvetica-Bold').text(`Laporan Pengajuan Cuti`, { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(`Periode: ${monthName} ${tahun}`, { align: 'center' });
        doc.moveDown(2);

        // Table generation logic
        const table = {
            headers: ["No.", "Tgl Pengajuan", "Nama Pegawai", "Jenis Cuti", "Tgl Mulai", "Tgl Selesai", "Status"],
            rows: requests.map((req, index) => [
                index + 1,
                new Date(req.createdAt).toLocaleDateString('id-ID'),
                req.user.nama,
                req.jenisCuti.nama,
                new Date(req.tanggalMulai).toLocaleDateString('id-ID'),
                new Date(req.tanggalSelesai).toLocaleDateString('id-ID'),
                req.status
            ])
        };

        const tableTop = doc.y;
        const rowHeight = 25;
        const colWidths = [40, 80, 150, 120, 80, 80, 100];
        let currentY = tableTop;

        // Function to draw a row
        const generateTableRow = (y, row, isHeader = false) => {
            doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(9);
            let currentX = 40;
            row.forEach((cell, i) => {
                doc.rect(currentX, y, colWidths[i], rowHeight).stroke();
                doc.text(cell.toString(), currentX + 5, y + 8, { width: colWidths[i] - 10, align: 'left' });
                currentX += colWidths[i];
            });
        };

        // Draw header
        generateTableRow(currentY, table.headers, true);
        currentY += rowHeight;

        // Draw rows
        table.rows.forEach(row => {
            generateTableRow(currentY, row);
            currentY += rowHeight;
        });

        // Summary
        doc.moveDown(2)
        const summaryX = 40;
        doc.fontSize(10).font('Helvetica-Bold').text('Ringkasan Laporan:', summaryX, doc.y);
        doc.font('Helvetica');
        doc.text(`Total Pengajuan: ${requests.length}`);
        doc.text(`Disetujui: ${requests.filter(r => r.status === 'DISETUJUI').length}`);
        doc.text(`Ditolak: ${requests.filter(r => r.status === 'DITOLAK').length}`);
        doc.text(`Menunggu: ${requests.filter(r => r.status === 'DIAJUKAN').length}`);

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal membuat PDF laporan: ' + error.message);
    }
};

module.exports = {
    getLaporan,
    getDashboardStats,
    downloadLaporanPdf
}; 