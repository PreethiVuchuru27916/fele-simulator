const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

class LocalOrgAuthorization {
    Authorize = async (req, res, next, role) => {
        const token = req.cookies.access_token

        if(!token) {
            res.status(403).send({
                message: "Access Token required"
            })
            return
        }

        try{
            const userData = jwt.verify(token, JWT_SECRET)
            if(userData.role == role) {
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

    Admin = (req, res, next) => {
        this.Authorize(req, res, next, "Admin")
    }
    Reader = (req, res, next) => {
        this.Authorize(req, res, next, "Reader")
    }
    Writer = (req, res, next) => {
        this.Authorize(req, res, next, "Writer")
    }
}

module.exports = new LocalOrgAuthorization()