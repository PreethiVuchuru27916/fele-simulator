const { createDatabase, deleteDatabase, insertToDatabase } = require('../../utils/db')
const path = require("path");
const fs = require('fs');

var dbPrefix = "fele__"
var chaincodeDirectory = "../../../chaincode/"

exports.createNetwork = async(networkConfigJSON, networkName) => {
    const database = dbPrefix+networkName
    const databaseCreated = await createDatabase(database)
    if(databaseCreated) insertToDatabase(database, JSON.parse(networkConfigJSON));
    //To create network folder under chaincode
    var dir = chaincodeDirectory+networkName
    dir = path.join(__dirname, dir);
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    } catch (err) {
        return false
    }
    return true
}

exports.deleteNetwork = async(networkName) => {
    const databaseName = "fele__"+networkName
    await deleteDatabase(databaseName)
}
