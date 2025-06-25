const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to perform this action',
            });
        }
        next();
    };
};

module.exports = authorize; 