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

    async createAsset(name, designation, salary) {
        const key = "Asset~" + uuidv4();
        const asset = AssetExists(key)
        if(!asset) {
            const value = {
                "name": name,
                "designation": designation,
                "salary": salary
            }
            const result = await SmartContract.putState(key, value);
            console.log(result)
            return result;
        }
        else throw new Error("Asset ID Already exists")
    } 

    async readAsset(key) {
        const result = await SmartContract.getState(key);
        console.log(result)
        return result;
    } 

    async AssetExists(key) {
        const asset = await SmartContract.getState(key);
        if(asset) return asset
        return null
    }
}

module.exports={
    EmployeeAsset
}