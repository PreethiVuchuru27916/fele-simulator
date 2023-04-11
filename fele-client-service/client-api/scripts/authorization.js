const { sha256 } = require('../../utils/helpers')
const logger = require('../../utils/logger')
const { getDocumentFromDatabase } = require('../../utils/db')
const isAdmin = async (org, username, password) => {
    password = sha256(password)
    try{
        const {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: org
                }
            }
        })
        json = docs[0];
        for (var i=0; i<json["localUsers"].length; i++) {
            if(json["localUsers"][i].username == username && json["localUsers"][i].password == password && json["localUsers"][i].role == "Admin"){
                return true;
            }
        }
        return false;
    } catch(error) {
        logger.error("Access Denied: " + error);
        return false;
    }
}

const isWriter = async (org, username, password) => {
    password = sha256(password)
    try{
        const {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: org
                }
            }
        })
        json = docs[0];
        for (var i=0; i<json["localUsers"].length; i++) {
            if(json["localUsers"][i].username == username && json["localUsers"][i].password == password && json["localUsers"][i].role == "Writer"){
                return true;
            }
        }
        return false;
    } catch(error) {
        logger.error("Access Denied: " + error)
    }
}

const isReader = async (org, username, password) => {
    password = sha256(password)
    try{
        const {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: org
                }
            }
        })
        json = docs[0];
        for (var i=0; i<json["localUsers"].length; i++) {
            if(json["localUsers"][i].username == username && json["localUsers"][i].password == password && json["localUsers"][i].role == "Reader"){
                return true;
            }
        }
        return false;
    } catch(error) {
        logger.error("Access Denied: " + error)
    }
}

const isUser = async (org, username, password) => {
    password = sha256(password)
    try{
        const {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: org
                }
            }
        })
        json = docs[0];
        for (var i=0; i<json["localUsers"].length; i++) {
            if(json["localUsers"][i].username == username && json["localUsers"][i].password == password){
                return true;
            }
        }
        return false;
    } catch(error) {
        logger.error("Access Denied: " + error)
    }
}

module.exports = {
    isAdmin,
    isReader,
    isWriter,
    isUser
}