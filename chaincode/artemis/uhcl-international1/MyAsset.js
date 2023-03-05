const { SmartContract } = require("../../../fele-smart-contract/SmartContract");

class MyAsset {
    async readAsset(key) {
        const result = await new SmartContract().getState(key);
        console.log(result)
    } 
    async putAsset(key, value) {
        const result = await new SmartContract().putState(key, value);
        console.log(result)
    } 
}

const testFunc = async() => {
    const asset = new MyAsset();
    const addedData = await asset.putAsset('123', { "data": "hello" });
    console.log(addedData);
}

testFunc();