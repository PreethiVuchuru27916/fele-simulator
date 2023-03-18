const { SmartContract } = require('../../../../../fele-smart-contract/SmartContract');

class MyAsset extends SmartContract {

    async createAsset(key, value) {
        const result = await SmartContract.putState(key, value);
        console.log(result)
        return result;
    } 

    async readAsset(key) {
        const result = await SmartContract.getState(key);
        console.log(result)
        return result;
    } 
}

module.exports={
    MyAsset
}