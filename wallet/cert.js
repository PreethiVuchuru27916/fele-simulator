const crypto = require("crypto");

const generateCertificate = (emp_id,attrs) => {
  const forge = require("node-forge");
  const pki = forge.pki;
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
  cert.emp_id = emp_id;
  cert.organization = attrs.name;
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
  employee_id: emp_id,
  certificate: pki.certificateToPem(cert),
  publicKey: publicKey,
  privateKey: privateKey
  }
};


module.exports = {
  generateCertificate
}