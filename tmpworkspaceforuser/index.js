const scapi = require('../bin/smartcontractapi/scapi');

const sampleSC = async() => {
    console.log(await scapi.getState("fele__gateway", "state.fele.felenet~root"))
    // const dataToBeInserted = {	
    //     "_id": "state.fele.felenet~root",
    //     "fmt": "felenet",
    //     "fmId": "root",
    //     "includeLedger": false,
    //     "transactionAware": false,
    //     "blockAware": false,
    //     "timestamping": false,
    //     "walletUnaware": false
    // }
    // console.log(await scapi.putState("fele__gateway", dataToBeInserted))
}

sampleSC()