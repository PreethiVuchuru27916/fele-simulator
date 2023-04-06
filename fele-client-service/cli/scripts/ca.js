const { registerUser, enrollUser} = require('../../client-api/scripts/ca');

const registerUserCLI = (options) => {
    return registerUser(options)
}

const enrollUserCLI = async(options) => {
    return enrollUser(options)
}

module.exports = {
  registerUserCLI,
  enrollUserCLI
}

