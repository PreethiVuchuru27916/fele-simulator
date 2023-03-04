const path = require('path')

const FELE_HOME = __dirname
const NETWORK_BASEPATH = path.join(__dirname, "chaincode")
const USER_WORKSPACE = path.join(__dirname, "tmpworkspaceforuser")

module.exports = {
    FELE_HOME,
    NETWORK_BASEPATH,
    USER_WORKSPACE
}