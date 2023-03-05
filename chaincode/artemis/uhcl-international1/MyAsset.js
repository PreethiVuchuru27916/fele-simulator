const { SmartContract } = require("../../../fele-smart-contract/SmartContract");

class MyAsset extends SmartContract {
    async readAsset(key) {
        const result = await SmartContract.getState(key);
        console.log(result)
        return result;
    } 
    async putAsset(key, value) {
        const result = await SmartContract.putState(key, value);
        console.log(result)
        return result;
    } 
}

const testFunc = async() => {
    const read = true;
    const asset = new MyAsset();
    if (read) {
        const readData = await asset.readAsset('123');
        console.log(readData);
    } else {
        const addedData = await asset.putAsset('123', { "data": "hello" });
        console.log(addedData);
    }
}


testFunc();