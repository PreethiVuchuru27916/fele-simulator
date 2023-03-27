# fele-simulator
Simulator for Hyperledger fabric that is a framework to develop permissioned blockchain applications.

[1] Install CouchDB. 

[2] Install NodeJS[Preferrable : v19.1.0], npm [Preferrable : 8.19.3]. 

[3] Perform npm install for downloading dependencies. 

[4] Try entering fele in the terminal. It should list Usage, Options and Commands. 

[5] Run `npm run dev` for starting the server

# To use json schema validator
```javascript
    const { valid, errors } = validateJSON(jsonSchema, jsonData);
    // valid => true / false
    // errors => object with all errors
```

# To use logger
```javascript
    logger.info("message"); // => logs info to command line
    logger.warn("warning"); // => logs warning message to command line
    logger.error("Error message"); // => logs error message to command line and logs.log file
```

# Chaincode commands
```shell
    chaincode register create -nn artemis -cn uhcl_international1 -ccn EmployeeAsset
    chaincode invoke -nn artemis -cn uhcl_international1 -ccn EmployeeAsset -ca {"Args":["init"]}
    chaincode invoke -nn artemis -cn uhcl_international1 -ccn EmployeeAsset -ca {"Args":["createAsset","Sample","Developer","4000"]}
    chaincode invoke -nn artemis -cn uhcl_international1 -ccn EmployeeAsset -ca {"Args":["readAsset","Asset~43012f4c-2fa4-4ded-859c-3aaa214541e8"]}
    chaincode invoke -nn artemis -cn uhcl_international1 -ccn EmployeeAsset -ca {"Args":["deleteAsset","Asset~43012f4c-2fa4-4ded-859c-3aaa214541e8"]}
    chaincode invoke -nn artemis -cn uhcl_international1 -ccn EmployeeAsset -ca {"Args":["updateAsset","Asset~287ef1d4-6588-49b7-803a-dc385ce266c9","Dave","Developer","10000"]}
```
