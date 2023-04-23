const { registerUser, enrollUser} = require('../../client-api/scripts/ca');

const registerUserCLI = async(affiliation,id) => {
    return registerUser(affiliation,id)
}

const enrollUserCLI = async(enrollmentId, mspId, network) => {
    return enrollUser(enrollmentId, mspId, network)
}

module.exports = {
  registerUserCLI,
  enrollUserCLI
}

