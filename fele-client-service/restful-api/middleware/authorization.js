const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const isAdmin = async (req, res, next) => {
    const token = req.cookies.access_token

    if(!token) {
        res.sendStatus(403)
        return
    }

    try{
        const userData = jwt.verify(token, JWT_SECRET)
        if(userData.role == "Admin") {
            req.username = userData.username
            req.userRole = userData.role
            req.organization = userData.organization
            next()
        } else {
            throw new Error("Access Admin role required to access this resource")
        }
    } catch(error) {
        res.status(401).send({
            message: "Access Denied: " + error.message
        })
    }
}

const isWriter = async (req, res, next) => {
    const token = req.cookies.access_token

    if(!token) {
        res.sendStatus(403)
        return
    }

    try{
        const userData = jwt.verify(token, JWT_SECRET)
        if(userData.role == "Writer") {
            req.username = userData.username
            req.userRole = userData.role
            req.organization = userData.organization
            next()
        } else {
            throw new Error("Access Writer role required to access this resource")
        }
    } catch(error) {
        res.status(401).send({
            message: "Access Denied: " + error.message
        })
    }
}

const isReader = async (req, res, next) => {
    const token = req.cookies.access_token

    if(!token) {
        res.sendStatus(403)
        return
    }

    try{
        const userData = jwt.verify(token, JWT_SECRET)
        if(userData.role == "Reader") {
            req.username = userData.username
            req.userRole = userData.role
            req.organization = userData.organization
            next()
        } else {
            throw new Error("Access Reader role required to access this resource")
        }
    } catch(error) {
        res.status(401).send({
            message: "Access Denied: " + error.message
        })
    }
}

module.exports = {
    isAdmin,
    isReader,
    isWriter
}