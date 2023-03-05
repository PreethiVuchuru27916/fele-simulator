const { SmartContract } = require("../../../fele-smart-contract/SmartContract");

class MyAsset extends SmartContract {
    async readAsset(key) {
        const result = await SmartContract.getState(key);
        console.log(result)
    } 
    async putAsset(key) {
        const result = await SmartContract.getState(key);
        console.log(result)
    } 
}