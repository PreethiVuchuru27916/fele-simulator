const jwt = require('jsonwebtoken')
const { getDocumentFromDatabase } = require('../../utils/db')
const {sha256} = require('../../utils/helpers')
const JWT_SECRET = process.env.JWT_SECRET

const authorize = (req, res, next) => {
    const token = req.cookies.access_token

    if(!token) {
        res.sendStatus(403)
    }

    try{
        const userData = jwt.verify(token, JWT_SECRET)
        req.username = userData.username
        req.userRole = userData.role
        req.organization = userData.organization
        next()
    } catch {
        res.sendStatus(401)
    }
}

const authenticateUser = async (req, res, next) => {
    const {organization} = req.params
    const {username, password} = req.body
    try {
        let {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: organization
                }
            }     
        })
    
        console.log("docs: ", docs)
        let localUsers = docs[0].localUsers

        let isAuthenticated = false, token = ""

        localUsers.forEach(user => {
            if(user.username === username && user.password === sha256(password)) {
                token = jwt.sign({
                    username,
                    organization,
                    role: user.role
            
                }, JWT_SECRET)
            

                isAuthenticated = true
            }
        });

        if(isAuthenticated) {

            
            res.cookie("access_token", token, {httpOnly: true}).status(200).send({
                message: `user '${username}' logged in successfully`
            })
        } else {
            throw new Error("Credentials not found")
        }
    } catch(error) {
        res.status(500).send({
            message: "Unable to Authenticate user: "+error
        })
    }
}

module.exports = {
    authenticateUser,
    authorize
}