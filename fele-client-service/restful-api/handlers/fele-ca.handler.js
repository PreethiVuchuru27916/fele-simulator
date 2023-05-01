const CA = require('../../client-api/scripts/ca')
const registerFeleUser = async (req, res) => {
    try {
        const {affiliation, id} = req.body
        const response = await CA.registerUserUsingREST(affiliation, id)
        res.status(200).send(response)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const enrollFeleUser = async (req, res) => {
    const {enrollmentId, enrollmentSecret} = req.body
    const {organization, network} = req.headers
    try {
        const response = await CA.enrollUserUsingREST(enrollmentId, enrollmentSecret, organization, network)
        res.status(200).send(response)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const getAllUserCredentialsForUser = async (req, res) => {
    const feleUser = req.query.feleUser
    if(feleUser) {
        try{
            const creds = await CA.getAllCredentialsForUser(feleUser)
            console.log(creds)
            res.status(200).send(creds)
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    } else {
        throw new Error("feleUser is required as query param")
    }
}

module.exports = {
    registerFeleUser,
    enrollFeleUser,
    getAllUserCredentialsForUser
}