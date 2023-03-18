const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const isAuthrorized = (req, res, next) => {
    const token = req.cookies.access_token
    if(!token) {
        res.sendStatus(403)
    }

    try{
        const userData = jwt.verify(token, JWT_SECRET)
        req.username = userData.username
        req.userRole = userData.role
        req.organization = "nasa"
        next()
    } catch {
        res.sendStatus(403)
    }
}

const authenticateUser = (req, res, next) => {
    const token = jwt.sign({
        username: req.body.username,
        role: "admin",
        organization: "nasa"

    }, JWT_SECRET)

    res.cookie("access_token", token, {httpOnly: true}).status(200).send({
        message: "Logged in successfully"
    })
}

module.exports = {
    authenticateUser,
    isAuthrorized
}