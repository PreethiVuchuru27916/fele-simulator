const forge = require('node-forge')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const KEY_STORE = path.join(__dirname, "wallet")

const makeNumberPositive = (hexString) => {
	let mostSignificativeHexDigitAsInt = parseInt(hexString[0], 16);

	if (mostSignificativeHexDigitAsInt < 8) return hexString;

	mostSignificativeHexDigitAsInt -= 8
	return mostSignificativeHexDigitAsInt.toString() + hexString.substring(1)
}

// Generate a random serial number for the Certificate
const randomSerialNumber = () => {
	return makeNumberPositive(forge.util.bytesToHex(forge.random.getBytesSync(20)));
}

// Get the Not Before Date for a Certificate (will be valid from today)
const getCertNotBefore = () => {
	let notBeforeDate = new Date(Date.now());
	let year = notBeforeDate.getFullYear();
	let month = (notBeforeDate.getMonth() + 1).toString().padStart(2, '0');
	let day = notBeforeDate.getDate();
	return new Date(`${year}-${month}-${day} 00:00:00Z`);
}

// Get Certificate Expiration Date (Valid for 1 year)
const getCertNotAfter = (notBefore) => {
	let year = notBefore.getFullYear() + 1;
	let month = (notBefore.getMonth() + 1).toString().padStart(2, '0');
	let day = notBefore.getDate();
	return new Date(`${year}-${month}-${day} 23:59:59Z`);
}

// Get CA Expiration Date (Valid for 100 Years)
const getCANotAfter = (notBefore) => {
	let year = notBefore.getFullYear() + 100;
	let month = (notBefore.getMonth() + 1).toString().padStart(2, '0');
	let day = notBefore.getDate();
	return new Date(`${year}-${month}-${day} 23:59:59Z`);
}

const DEFAULT_C = 'United States';
const DEFAULT_ST = 'Texas';
const DEFAULT_L = 'Houston';

const CreateRootCA = () => {
    // Create a new Keypair for the Root CA
    const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);

    // Define the attributes for the new Root CA
    const attributes = [{
        shortName: 'C',
        value: DEFAULT_C
    }, {
        shortName: 'ST',
        value: DEFAULT_ST
    }, {
        shortName: 'L',
        value: DEFAULT_L
    }, {
        shortName: 'CN',
        value: 'FELE Root CA'
    }];

    const extensions = [{
        name: 'basicConstraints',
        cA: true
    }, {
        name: 'keyUsage',
        keyCertSign: true,
        cRLSign: true
    }];

    // Create an empty Certificate
    const cert = forge.pki.createCertificate();

    // Set the Certificate attributes for the new Root CA
    cert.publicKey = publicKey;
    cert.privateKey = privateKey;
    cert.serialNumber = randomSerialNumber;
    cert.validity.notBefore = getCertNotBefore();
    cert.validity.notAfter = getCANotAfter(cert.validity.notBefore);
    cert.setSubject(attributes);
    cert.setIssuer(attributes);
    cert.setExtensions(extensions);

    // Self-sign the Certificate
    cert.sign(privateKey, forge.md.sha512.create());

    // Convert to PEM format
    const pemCert = forge.pki.certificateToPem(cert);
    const pemKey = forge.pki.privateKeyToPem(privateKey);

    if (!fs.existsSync(KEY_STORE)){
        fs.mkdirSync(KEY_STORE, { recursive: true });
    }

    fs.writeFileSync(KEY_STORE + '/certificate.pem', pemCert)

    fs.writeFileSync(KEY_STORE + '/private.pem', pemKey)

    // Return the PEM encoded cert and private key
    return { certificate: pemCert, privateKey: pemKey, notBefore: cert.validity.notBefore, notAfter: cert.validity.notAfter };
}

const CreateHostCert = (hostCertCN, validDomains, rootCAObject) => {
    if (!hostCertCN.toString().trim()) throw new Error('"hostCertCN" must be a String');
    if (!Array.isArray(validDomains)) throw new Error('"validDomains" must be an Array of Strings');
    if (!rootCAObject || !rootCAObject.hasOwnProperty('certificate') || !rootCAObject.hasOwnProperty('privateKey')) throw new Error('"rootCAObject" must be an Object with the properties "certificate" & "privateKey"');

    // Convert the Root CA PEM details, to a forge Object
    let caCert = forge.pki.certificateFromPem(rootCAObject.certificate);
    let caKey = forge.pki.privateKeyFromPem(rootCAObject.privateKey);

    // Create a new Keypair for the Host Certificate
    const hostKeys = forge.pki.rsa.generateKeyPair(2048);

    // Define the attributes/properties for the Host Certificate
    const attributes = [{
        shortName: 'C',
        value: DEFAULT_C
    }, {
        shortName: 'ST',
        value: DEFAULT_ST
    }, {
        shortName: 'L',
        value: DEFAULT_L
    }, {
        shortName: 'CN',
        value: hostCertCN
    }];

    const extensions = [{
        name: 'basicConstraints',
        cA: false
    }, {
        name: 'nsCertType',
        server: true
    }, {
        name: 'subjectKeyIdentifier'
    }, {
        name: 'authorityKeyIdentifier',
        authorityCertIssuer: true,
        serialNumber: caCert.serialNumber
    }, {
        name: 'keyUsage',
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true
    }, {
        name: 'extKeyUsage',
        serverAuth: true
    }, {
        name: 'subjectAltName',
        altNames: validDomains.map(domain => { return { type: 2, value: domain } })
    }];

    // Create an empty Certificate
    let newHostCert = forge.pki.createCertificate();

    // Set the attributes for the new Host Certificate
    newHostCert.publicKey = hostKeys.publicKey;
    newHostCert.serialNumber = randomSerialNumber();
    newHostCert.validity.notBefore = getCertNotBefore();
    newHostCert.validity.notAfter = getCertNotAfter(newHostCert.validity.notBefore);
    newHostCert.setSubject(attributes);
    newHostCert.setIssuer(caCert.subject.attributes);
    newHostCert.setExtensions(extensions);

    // Sign the new Host Certificate using the CA
    newHostCert.sign(caKey, forge.md.sha512.create());

    // Convert to PEM format
    let pemHostCert = forge.pki.certificateToPem(newHostCert);
    let pemHostKey = forge.pki.privateKeyToPem(hostKeys.privateKey);

    return { certificate: pemHostCert, privateKey: pemHostKey, notAfter: newHostCert.validity.notBefore, notAfter: newHostCert.validity.notAfter };
}

let CA = CreateRootCA();
/* The following certificate:
	- Will be called 'testing.com'.
	- Will be valid for 'testing.com' and 'test.com'.
	- Will be signed by the CA we just created above.
*/
let hostCert = CreateHostCert('testing.com', ['testing.com', 'test.com'], CA);

console.log(CA.certificate);
console.log(hostCert.certificate);

const caCertificate = forge.pki.certificateFromPem(CA.certificate);
const certificate = forge.pki.certificateFromPem(hostCert.certificate);
console.log("verified: ", _.isEqual(caCertificate.subject.attributes, certificate.issuer.attributes))
console.log("Host info: ", certificate.subject.attributes)
module.exports = {
    CreateRootCA,
    CreateHostCert
}