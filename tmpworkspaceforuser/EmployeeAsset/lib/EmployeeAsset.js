const { SmartContract } = require('../../../../../fele-smart-contract/SmartContract');
const { v4: uuidv4 } = require('uuid');

class EmployeeAsset extends SmartContract {

    async init() {
        const employees = [
            {
                "name": "Emily Shaw",
                "designation": "Developer",
                "salary": 5000
            },
            {
                "name": "Elmer Reese",
                "designation": "Designer",
                "salary": 6000
            }
        ]
        
        employees.forEach(async(employee) => {
            const employeeAsset = { ...employee };
            const key = "Asset~" + uuidv4();
            employeeAsset.fmt = "asset";
            await SmartContract.putState(key, EmployeeAsset)
        })

    }

    async createAsset(id, name, age) {
        
        const result = await SmartContract.putState(key, value);
        console.log(result)
        return result;
    } 

    async readAsset(key) {
        const result = await SmartContract.getState(key);
        console.log(result)
        return result;
    } 

    async AssetExists(key) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

module.exports={
    EmployeeAsset
}