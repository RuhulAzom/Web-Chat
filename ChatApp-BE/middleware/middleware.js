
const jwt = require("jsonwebtoken")
exports.Authentication = (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        const token = authToken && authToken.split(" ")[1];
        const secretKey = process.env.JWT_TOKEN_KEY;
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: "Unauthorized"
                })
            } else {
                req.decoded = decoded;
                return next();
            }
        })
    } catch (error) {
        console.log("Error in authentication:", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Error In Authentication"
        })
    }
}
