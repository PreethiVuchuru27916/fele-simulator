const { SmartContract } = require('../../../../../fele-smart-contract/SmartContract');
const { v4: uuidv4 } = require('uuid');

class EmployeeAsset extends SmartContract {
    async init(network) {
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
            await SmartContract.putState(key, employeeAsset, network)
        })
        
    }

    async AssetExists(key,network) {
        const asset = await SmartContract.getState(key, network);
        if(asset) return asset
        return null
    }

    async createAsset(name, designation, salary, network) {
        const key = "Asset~" + uuidv4();
        const asset = await this.AssetExists(key, network)
        if (!asset) {
            const value = {
                "name": name,
                "designation": designation,
                "salary": salary
            }
            return await SmartContract.putState(key, value, network);;
        }
        else throw new Error("Asset ID already exists")
    } 
    
    async readAsset(key, network) {
        const result = await SmartContract.getState(key, network);
        return result;
    }

    async updateAsset(key, name = "", designation = "", salary = "", network) {
        const asset = await this.AssetExists(key, network);
        if (asset) {
            const value = {
                "name": name.length ? name : asset.name,
                "designation": designation.length ? designation : asset.designation,
                "salary": salary.length ? salary : asset.salary
            }
            return await SmartContract.putState(key, value, network);
        }
        else throw new Error("Asset does not exist!");
    }
    
    async deleteAsset(key, network) {
        const asset = await this.AssetExists(key, network)
        if(asset) {
            return await SmartContract.deleteState(key, network);
        }
        else throw new Error("Asset ID does not exists")
    } 
}

module.exports={
    EmployeeAsset
}