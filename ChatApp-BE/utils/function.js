const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.hashPassword = (rawPassword) => {
    return bcrypt.hashSync(rawPassword, 10)
}

exports.comparePassword = (rawPassword, databasePassword) => {
    return bcrypt.compareSync(rawPassword, databasePassword);
}

exports.generateToken = (data) => {
    const token = jwt.sign({
        data: data
    }, process.env.JWT_TOKEN_KEY, { expiresIn: "24h" });
    return token;
}

exports.extractToken = (token) => {
    const secretKey = process.env.JWT_TOKEN_KEY;
    let resData;
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            resData = null
        } else {
            resData = decoded
        }
    })

    if (resData) {
        return resData;
    }
    return null;
}