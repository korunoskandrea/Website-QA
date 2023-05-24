exports.mustBeAuthenticated = async (req, res, next) => {
    console.log(req.user)
    if (req.user) {
        next();
        return;
    }
    res.status(401).json({
        message: 'Please authenticate'
    });
}

exports.mustNotBeAuthenticated = async (req, res, next) => {
    if (!req.user) {
        next();
        return;
    }
    res.status(400).json({
        message: 'You are already authenticated'
    });
}