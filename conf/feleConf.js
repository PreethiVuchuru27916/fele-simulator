require('dotenv').config()

const feleConfig = {
    "couchdb": {
        "username" : process.env.COUCH_DB_USERNAME,
        "password" : process.env.COUCH_DB_PASSWORD,
        "port": 5984
    },
    "logging": {
        "file" : "../logs/log.txt"
    },
    "server": {
        "port": 8005
    },
    "chaincode": {
        "chaincode_dir": "../../../chaincode/"
    }
}

module.exports = {
    ...feleConfig
}


