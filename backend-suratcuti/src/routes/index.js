const authRoutes = require('./authRoutes');
const jenisCutiRoutes = require('./jenisCutiRoutes');
const kuotaRoutes = require('./kuotaRoutes');
const cutiRoutes = require('./cutiRoutes');
const laporanRoutes = require('./laporanRoutes');
const userRoutes = require('./userRoutes');

const mountRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/jenis-cuti', jenisCutiRoutes);
    app.use('/api/kuota', kuotaRoutes);
    app.use('/api/cuti', cutiRoutes);
    app.use('/api/laporan', laporanRoutes);
};

module.exports = mountRoutes; 