const { generateCertificate } = require("./cert")
const fs = require('fs');
var json = {}
const CA = {name: "uhcl", value: "walletID1234"};
//const CA = {name: "utd", value: "walletID567"};
const {  createDatabase, checkIfDatabaseExists, insertToDatabase, updateDocument, getDocumentFromDatabase } = require('../fele-client-service/utils/db');
const logger = require("../fele-client-service/utils/logger");

const addCertificateToWallet = async(emp_id,CA) => {
  const certificate = generateCertificate(emp_id,CA);
  const dbstatus = await checkIfDatabaseExists("wallet");
  if(!dbstatus){
    await createDatabase("wallet");
    console.log("Database \"wallet\" created.")
  }
  const query = {
    selector: {
      fmt_id: {
        $eq: CA.value
      }
    }
  };
  const { docs } = await getDocumentFromDatabase("wallet", query)
  if(docs.length == 0){
    json = Object.assign({}, json, {"fmt_id": CA.value,"fmt": "wallet",[CA.name]:[]});
    json[CA.name].push(certificate);
    try{
      insertToDatabase("wallet",json);
      logger.info("Certificate successfully inserted into document with fmt_id: "+CA.value);
    }
    catch (e){
      logger.error(e)
    }
  }
  else{
    json = docs[0];
    for (var i=0; i<json[CA.name].length; i++) {
      if(json[CA.name][i].employee_id == emp_id){
        logger.error("The employee with emp_id = "+emp_id+" already has a certificate issued from this organization");
        return;
      }
    }
    json[CA.name].push(certificate);
    try{
      updateDocument("wallet",json);
      logger.info("Certificate successfully inserted into document with fmt_id: "+CA.value);
    }
    catch (e){
      logger.error(e)
    }
  }
}

addCertificateToWallet("emp_14",CA);