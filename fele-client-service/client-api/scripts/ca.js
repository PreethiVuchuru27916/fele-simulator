const crypto = require("crypto");
const generator = require('generate-password');
const forge = require("node-forge");
const pki = forge.pki;
const { insertToDatabase, checkIfDatabaseExists, getDocumentFromDatabase, deleteDocument, createDatabase } = require('../../utils/db')
const { v4: uuidv4 } = require('uuid')
const { getCredentialSelector, getEnrollmentSelector, getSelector, generateCertificate, sha256 } = require('../../utils/helpers')
const { CREDENTIAL_ID_PREFIX } = require('../../utils/constants')
const {BID} = require('../../utils/constants')

// A possible overlook.
// What if the admin register user using cli and user wants to enroll using client application using REST
// Below is Function designed to use when state is maintained
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

const enrollUser = async(options, unique=true) => {
    const args = { orgName: options.mspId };
    
    const dbStatus = await checkIfDatabaseExists(BID)
    if(!dbStatus) {
        await createDatabase(BID)
    }

    if(unique) {
        const { docs } = await getDocumentFromDatabase(BID, getCredentialSelector(options.enrollmentId))
    
        if (docs.length > 0) {
            throw new Error(`Fele user ${options.enrollmentId} exists. please choose a differnet name`)
        }
    }
    
    const { feleUser, certificate, publicKey, privateKey } = generateCertificate(options.enrollmentId, args);
    
    const cred_id = await insertToDatabase(BID, {
        _id : CREDENTIAL_ID_PREFIX + uuidv4(),
        fmt : "credential",
        feleUser,
        certificate,
        publicKey,
        privateKey
    })

    return cred_id
}

//Stateless
const registerUserUsingREST = async (affiliation, id) => {
    const enrollCredentials = registerUser({affiliation, id})
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

const enrollUserUsingREST = async (enrollmentId, enrollmentSecret, organization) => {
    
    const dbStatus = await checkIfDatabaseExists(BID)
    if(dbStatus) {
        const { docs } = await getDocumentFromDatabase(BID, getEnrollmentSelector(enrollmentId))
        if (docs.length == 0) {
            throw new Error('Enrollment ID not found')
        }
        if(docs[0].enrollmentSecret == enrollmentSecret) {
            try{
                const res = await enrollUser({mspId: organization, enrollmentId})
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