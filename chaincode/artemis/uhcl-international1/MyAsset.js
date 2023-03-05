const { SmartContract } = require("../../../fele-smart-contract/SmartContract");

class MyAsset extends SmartContract {
    async readAsset(key) {
        const result = SmartContract.getState(key);
        console.log(result)
        return result;
    } 
    async putAsset(key, value) {
        const result = SmartContract.putState(key, value);
        console.log(result)
        return result;
    } 
}

const testFunc = async() => {
    const asset = new MyAsset();
    //const addedData = await asset.putAsset('123', { "data": "hello" });
    const readData = await asset.readAsset('123');
    //console.log(addedData);
    console.log(readData);
}


testFunc();