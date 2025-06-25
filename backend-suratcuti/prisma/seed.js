const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            email: 'admin@admin.com',
            password: adminPassword,
            nama: 'Admin User',
            role: 'admin',
            nip: 'ADMIN001',
            jabatan: 'Administrator'
        },
    });

    const pegawaiPassword = await bcrypt.hash('pegawai123', 10);
    const pegawai = await prisma.user.upsert({
        where: { email: 'pegawai@test.com' },
        update: {},
        create: {
            email: 'pegawai@test.com',
            password: pegawaiPassword,
            nama: 'Pegawai User',
            role: 'pegawai',
            nip: 'PEG001',
            jabatan: 'Staff'
        },
    });

    const jenisCutiData = [
        { nama: 'Cuti Tahunan', maxHari: 12, deskripsi: 'Hak cuti tahunan pegawai.' },
        { nama: 'Cuti Sakit', maxHari: 14, deskripsi: 'Cuti karena sakit (memerlukan surat dokter jika >2 hari).' },
        { nama: 'Cuti Melahirkan', maxHari: 90, deskripsi: 'Cuti untuk ibu melahirkan.' },
        { nama: 'Cuti Alasan Penting', maxHari: 7, deskripsi: 'Cuti untuk keperluan mendesak (pernikahan, duka, dll).' },
    ];

    for (const jenis of jenisCutiData) {
        await prisma.jenisCuti.upsert({
            where: { nama: jenis.nama },
            update: {},
            create: jenis,
        });
    }

    const allJenisCuti = await prisma.jenisCuti.findMany();
    const allPegawai = await prisma.user.findMany({ where: { role: 'pegawai' } });
    const tahun = new Date().getFullYear();

    for (const p of allPegawai) {
        for (const jc of allJenisCuti) {
            await prisma.kuotaCuti.upsert({
                where: {
                    userId_jenisCutiId_tahun: {
                        userId: p.id,
                        jenisCutiId: jc.id,
                        tahun: tahun,
                    },
                },
                update: {},
                create: {
                    userId: p.id,
                    jenisCutiId: jc.id,
                    tahun: tahun,
                    totalKuota: jc.maxHari,
                    sisaKuota: jc.maxHari,
                },
            });
        }
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 