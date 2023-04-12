const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

class LocalOrgAuthorization {
    Authorize = async (req, res, next, role, any=false) => {
        const token = req.headers.authorization

        if(!token) {
            res.status(403).send({
                message: "Authorization header required"
            })
            return
        }

        try{
            const userData = jwt.verify(token, JWT_SECRET)
            if((userData.role == role) || any) {
                req.username = userData.username
                req.userRole = userData.role
                req.organization = userData.organization
                next()
            } else {
                throw new Error(`Access ${role} role required to access this resource`)
            }
        } catch(error) {
            res.status(401).send({
                message: "Access Denied: " + error.message
            })
        }
    }

    Admin = (req, res, next) => {
        this.Authorize(req, res, next, "Admin")
    }
    Reader = (req, res, next) => {
        this.Authorize(req, res, next, "Reader")
    }
    Writer = (req, res, next) => {
        this.Authorize(req, res, next, "Writer")
    }
    Any = (req, res, next) => {
        this.Authorize(req, res, next, "Any", true)
    }
}

module.exports = new LocalOrgAuthorization()