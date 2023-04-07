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
    const organization = req.headers.organization
    try {
        const response = await CA.enrollUserUsingREST(enrollmentId, enrollmentSecret, organization)
        res.status(200).send(response)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

module.exports = {
    registerFeleUser,
    enrollFeleUser
}