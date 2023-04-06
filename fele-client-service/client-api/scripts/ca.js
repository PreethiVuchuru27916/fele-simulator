const crypto = require("crypto");
const generator = require('generate-password');
const forge = require("node-forge");
const pki = forge.pki;
const { insertToDatabase, checkIfDatabaseExists, getDocumentFromDatabase } = require('../../utils/db')
const { v4: uuidv4 } = require('uuid')
const { getCredentialSelector, generateCertificate } = require('../../utils/helpers')
const { CREDENTIAL_ID_PREFIX } = require('../../utils/constants')

const registerUser = (options) => {
    let enrollmentID = options.affiliation+"."+options.id;
    
    let enrollmentSecret = generator.generate({
        length: 14,
        numbers: true
    });
    
    return {
        enrollmentID,
        enrollmentSecret
    }
}

const enrollUser = async(options) => {
    const args = { orgName: options.mspId };
    
    const database = "fele__bid";
    const dbStatus = await checkIfDatabaseExists(database)
    if(dbStatus) {
        const { docs } = await getDocumentFromDatabase(database, getCredentialSelector(options.enrollmentId))
        
        if (docs.length > 0) {
            return null
        }
        
        const { feleUser, certificate, publicKey, privateKey } = generateCertificate(options.enrollmentId, args);
     
        const cred_id = await insertToDatabase(database, {
            _id : CREDENTIAL_ID_PREFIX + uuidv4(),
            fmt : "credential",
            feleUser,
            certificate,
            publicKey,
            privateKey
        })
    
        return cred_id
    }
    return null 
}

module.exports = {
  generateCertificate,
  registerUser,
  enrollUser
}