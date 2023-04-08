const { createHash, generateKeyPairSync } = require('crypto')
const forge = require("node-forge");
const pki = forge.pki;
const fs = require('fs');
const path = require("path");

const sha256 = (content) => {  
    return createHash('sha256').update(content).digest('hex')
}

const getChannelSelector = (channelName) => {
    return {
        selector: {
            channelName: {
                $eq: channelName
            }
        }     
    }
}

const getCredentialSelector = (feleUser) => {
    return {
        selector: {
            feleUser: {
                $eq: feleUser
            }
        }     
    }
}

const getEnrollmentSelector = (enrollmentId) => {
    return {
        selector: {
            enrollmentId: {
                $eq: enrollmentId
            }
        }
    }
}

const getSelector = (key, value) => {
    const sel = {selector: {}}
    sel.selector[key] = {$eq: value}
    return sel
}

const selectorForLocalOrganization = (orgName) => {
    return {
        selector: {
            fmt: {
                $eq: "LocalOrganization"
            },
            organization: {
                $eq: orgName
            }
        }
    }
}

const generateCertificate = (user,attrs) => {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      namedCurve: 'secp256k1', 
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    const prKey = pki.privateKeyFromPem(privateKey);
    const pubKey = pki.publicKeyFromPem(publicKey);
  
    const cert = pki.createCertificate();
  
    // fill the required fields
    cert.CN = user;
    cert.organization = attrs.orgName;
    cert.publicKey = pubKey;
    cert.serialNumber = "01";
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );
    // here we set subject and issuer as the same one
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
  
    cert.sign(prKey);
    return {
      feleUser: user,
      certificate: pki.certificateToPem(cert),
      publicKey: publicKey,
      privateKey: privateKey
    }
};

function copyFolderSync(from, to) {
    fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}


module.exports = {
    sha256,
    getChannelSelector,
    getCredentialSelector,
    getEnrollmentSelector,
    selectorForLocalOrganization,
    getSelector,
    generateCertificate,
    copyFolderSync
}