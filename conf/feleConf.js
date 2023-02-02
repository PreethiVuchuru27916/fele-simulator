require('dotenv').config()

module.exports = {
    couchdb: {
        username : process.env.COUCH_USER_NAME, //admin
        password : process.env.COUCH_PASSWORD,  //u1234
        port: process.env.COUCH_PORT    //5984
    },
    logging: {
        file : "../logs/log.txt"
    },
    server: {
        port: process.env.SERVER_PORT   //8005
    },
    chaincode: {
        chaincode_dir: "../../../chaincode/"
    }
}


