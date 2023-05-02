const crypto = require("crypto");
const generator = require('generate-password');
const forge = require("node-forge");
const pki = forge.pki;
const logger = require('../../utils/logger')
const { insertToDatabase, checkIfDatabaseExists, getDocumentFromDatabase, deleteDocument, createDatabase, updateDocument } = require('../../utils/db')
const { v4: uuidv4 } = require('uuid')
const { getCredentialSelector, getEnrollmentSelector, getSelector, generateCertificate, sha256 } = require('../../utils/helpers')
const { CREDENTIAL_ID_PREFIX, NETWORK_PREFIX, ORG_FMT } = require('../../utils/constants')
const {BID} = require('../../utils/constants')

// A possible overlook.
// What if the admin register user using cli and user wants to enroll using client application using REST
// Below is Function designed to use when state is maintained
const registerUser = async(affiliation,id) => {
    let enrollmentID = affiliation+"."+id;
    
    let enrollmentSecret = generator.generate({
        length: 14,
        numbers: true
    });
    
    return {
        enrollmentID,
        enrollmentSecret
    }
}

const enrollUser = async(enrollmentId, mspId, network, unique=true) => {
    try{
        const args = { orgName: mspId};
        const dbStatus = await checkIfDatabaseExists(BID)
        if(!dbStatus) {
            await createDatabase(BID)
        }

        if(unique) {
            const { docs } = await getDocumentFromDatabase(BID, getCredentialSelector(enrollmentId))
            if (docs.length > 0) {
                throw new Error(`Fele user ${enrollmentId} exists. please choose a differnet name`)
            }
        }
        
        const { feleUser, certificate, publicKey, privateKey } = generateCertificate(enrollmentId, args);
        
        const cred_id = await insertToDatabase(BID, {
            _id : CREDENTIAL_ID_PREFIX + uuidv4(),
            fmt : "credential",
            feleUser,
            certificate,
            publicKey,
            privateKey
        })
        console.log(cred_id)
        const database = NETWORK_PREFIX + network
        const dbExist = checkIfDatabaseExists(database)
        if(dbExist){
            let {docs} = await getDocumentFromDatabase(database, getSelector(ORG_FMT,args.orgName))
            if(docs.length>0){
                docs[0].feleUsers.push({feleUserId:feleUser,publicKey})
                await updateDocument(database, docs[0])
            }
            else{
                logger.error(`Fele Organization ${args.orgName} does not exist.`)
                throw new Error(`Fele Organization ${args.orgName} does not exist.`)
            }
        }
        else{
            logger.error(`Fele Network ${network} does not exist.`)
        }
        return cred_id
    }catch(e){
        logger.error(e)
        throw new Error(e.message)
    }
}

//Stateless
const registerUserUsingREST = async (affiliation, id) => {
    const enrollCredentials = await registerUser(affiliation, id)
    try {
        await insertToDatabase(BID, {
            _id : "enrollment~" + uuidv4(),
            fmt : "enrollment",
            enrollmentId: enrollCredentials.enrollmentID,
            enrollmentSecret: sha256(enrollCredentials.enrollmentSecret)
        })
        console.log("encrypted: ", sha256(enrollCredentials.enrollmentSecret))
        return enrollCredentials
    } catch (error) {
        throw new Error(`Unable to register user ${affiliation}.${id}: ${error.message}`)
    }

}

const enrollUserUsingREST = async (enrollmentId, enrollmentSecret, organization, network) => {
    
    const dbStatus = await checkIfDatabaseExists(BID)
    if(dbStatus) {
        const { docs } = await getDocumentFromDatabase(BID, getEnrollmentSelector(enrollmentId))
        if (docs.length == 0) {
            throw new Error('Enrollment ID not found')
        }
        if(docs[0].enrollmentSecret == enrollmentSecret) {
            try{
                const res = await enrollUser(enrollmentId, organization, network)
                return res
            } catch(error) {
                throw new Error(error.message)
            } finally {
                await deleteDocument(BID, docs[0]._id, docs[0]._rev)
            }

        } else {
            throw new Error("Enrollment secret mismatch")
        }
    }
}

const getAllCredentialsForUser = async (feleUser) => {
    console.log("feleuser: ", getSelector("feleUser", feleUser))
    const { docs } = await getDocumentFromDatabase(BID, getSelector("feleUser", feleUser))
    const userCreds = docs.map(cred => {
        
        return cred._id
    })
    return userCreds
}

module.exports = {
  generateCertificate,
  registerUser,
  enrollUser,
  enrollUserUsingREST,
  registerUserUsingREST,
  getAllCredentialsForUser
}