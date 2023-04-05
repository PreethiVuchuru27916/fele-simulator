const { BID } = require("../../utils/constants")
const jwt = require('jsonwebtoken')
const { getDocumentFromDatabase } = require('../../utils/db')
const {sha256} = require('../../utils/helpers')
const JWT_SECRET = process.env.JWT_SECRET

class LocalOrgAuthentication {
    Authenticate = async (req, res, next) => {
        //const organization = req.headers.organization
        const organization = req.headers.organization
        console.log(organization)
        if(organization) {
            const {username, password} = req.body
            try {
                let {docs} = await getDocumentFromDatabase(BID, {
                    selector: {
                        organization: {
                            $eq: organization
                        }
                    }     
                })
    
                let localUsers = docs[0].localUsers
    
                let isAuthenticated = false, token = ""
                console.log(organization, username, password)
                localUsers.forEach(user => {
                    if(user.username === username && user.password === password) {
                        token = jwt.sign({
                            username,
                            organization,
                            role: user.role
                    
                        }, JWT_SECRET)
                        isAuthenticated = true
                        return
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
        } else {
            res.status(400).send({
                message: "Mandatory header 'organization' is missing in the request"
            })
        }
    }
}

module.exports = new LocalOrgAuthentication()