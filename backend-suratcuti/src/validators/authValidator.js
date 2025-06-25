const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    nama: Joi.string().required(),
    nip: Joi.string().required(),
    jabatan: Joi.string().required(),
    role: Joi.string().valid('pegawai', 'admin').optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
}; 