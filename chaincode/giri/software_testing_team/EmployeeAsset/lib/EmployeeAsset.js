const { Context } = require('../../../../../fele-smart-contract/Context');
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
            await SmartContract.putState(key, employeeAsset)
        })
        
    }

    async AssetExists(key) {
        const asset = await SmartContract.getState(key);
        if(asset) return asset
        return null
    }

    async createAsset(name, designation, salary) {
        const key = "Asset~" + uuidv4();
        const asset = await this.AssetExists(key)
        if (!asset) {
            const value = {
                "name": name,
                "designation": designation,
                "salary": salary
            }
            return await SmartContract.putState(key, value);;
        }
        else throw new Error("Asset ID already exists")
    } 
    
    async readAsset(key) {
        const result = await SmartContract.getState(key);
        return result;
    }

    async getAllAssets() {
        const query = { 
            "selector": {
                "fmt": {
                    "$eq": "Asset"
                },
                "channelName": {
                    "$eq": Context.globalState.channelName
                }
            }
        }
        const result = await SmartContract.getQueryByResult(query);
        console.log("Result is"+result.docs)
        return result.docs;
    }

    async updateAsset(key, name = "", designation = "", salary = "") {
        const asset = await this.AssetExists(key);
        if (asset) {
            const value = {
                "name": name.length ? name : asset.name,
                "designation": designation.length ? designation : asset.designation,
                "salary": salary.length ? salary : asset.salary
            }
            return await SmartContract.putState(key, value);
        }
        else throw new Error("Asset does not exist!");
    }
    
    async deleteAsset(key) {
        const asset = await this.AssetExists(key)
        if(asset) {
            return await SmartContract.deleteState(key);
        }
        else throw new Error("Asset ID does not exists")
    }  
}

module.exports={
    EmployeeAsset
}