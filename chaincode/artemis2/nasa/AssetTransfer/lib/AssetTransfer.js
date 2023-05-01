const { v4: uuidv4 } = require('uuid');
const { SmartContract } = require('../../../../../fele-smart-contract/SmartContract');
const { Context } = require('../../../../../fele-smart-contract/Context');

class AssetTransfer extends SmartContract {
    async init() {
        const assets = [
            {
                Color: 'blue',
                Size: 5,
                Owner: 'Tomoko',
                AppraisedValue: 300,
            },
            {
                Color: 'red',
                Size: 5,
                Owner: 'Brad',
                AppraisedValue: 400,
            },
            {
                Color: 'green',
                Size: 10,
                Owner: 'Jin Soo',
                AppraisedValue: 500,
            },
            {
                Color: 'yellow',
                Size: 10,
                Owner: 'Max',
                AppraisedValue: 600,
            }
        ]
        
        assets.forEach(async(asset) => {
            const assetVal = { ...asset };
            const key = "Asset~" + uuidv4();
            assetVal.fmt = "asset";
            await SmartContract.putState(key, assetVal)
        })
        
    }

    async AssetExists(key) {
        const asset = await SmartContract.getState(key);
        if(asset) return asset
        return null
    }

    async createAsset(jsonValue) {
        console.log("jsomValue inside create aset"+jsonValue)
        const key = "Asset~" + uuidv4();
        const asset = await this.AssetExists(key)
        if (!asset) {
            return await SmartContract.putState(key, jsonValue);
        }
        else throw new Error("Asset ID already exists")
    } 
    
    async readAsset(key) {
        const result = await SmartContract.getState(key);
        return result;
    }

    async updateAsset(key, jsonValue) {
        const asset = await this.AssetExists(key);
        if (asset) {
            return await SmartContract.putState(key, jsonValue);
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
}

module.exports={
    AssetTransfer
}