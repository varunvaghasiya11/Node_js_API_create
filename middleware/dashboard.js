const { verifyToken } = require("../utils/jwt");
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = verifyToken(token);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

const authorize = (roles) => {
    return (req, res, next) => {
        console.log(roles);
        console.log(req.user.role);
        
        if (!roles.includes(req.user.role)) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        next();
    }
}

module.exports = { auth, authorize };