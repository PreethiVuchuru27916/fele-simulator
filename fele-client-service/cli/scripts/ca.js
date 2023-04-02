const crypto = require("crypto");
const generator = require('generate-password');
const forge = require("node-forge");
const pki = forge.pki;
const { insertToDatabase } = require('../../utils/db')
const { v4: uuidv4 } = require('uuid')

const { WALLET_ID_PREFIX } = require('../../utils/constants')

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
    const args = {orgName: options.mspId, value: "walletID1234"};
    
    const { feleUser, certificate, publicKey, privateKey } = generateCertificate(options.enrollmentId, args);
 
    const wallet_id = await insertToDatabase("fele__bid", {
        _id : WALLET_ID_PREFIX + uuidv4(),
        fmt : "wallet",
        feleUser,
        certificate,
        publicKey,
        privateKey
    })

    return wallet_id
}

const generateCertificate = (user,attrs) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
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

module.exports = {
  generateCertificate,
  registerUser,
  enrollUser
}