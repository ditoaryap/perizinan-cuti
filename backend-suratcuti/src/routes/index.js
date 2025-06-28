const authRoutes = require('./authRoutes');
const jenisCutiRoutes = require('./jenisCutiRoutes');
const kuotaRoutes = require('./kuotaRoutes');
const cutiRoutes = require('./cutiRoutes');
const laporanRoutes = require('./laporanRoutes');
const userRoutes = require('./userRoutes');

const mountRoutes = (app) => {
    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);
    app.use('/jenis-cuti', jenisCutiRoutes);
    app.use('/kuota', kuotaRoutes);
    app.use('/cuti', cutiRoutes);
    app.use('/laporan', laporanRoutes);
};

module.exports = mountRoutes; 