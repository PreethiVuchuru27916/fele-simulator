/*const { checkIfNetworkExists, insertToDatabase } = require('../../utils/db')
const { validateSchema } = require('../../utils/schema-validator')
const path = require("path");
const fs = require('fs');
const USER_WORKSPACE = "../../../tmpworkspaceforuser/"
const jsonSch = 'feleChannelSchema.json'

const createChannel = async (networkName, channelName, channelConfig) =>
{
  const database = "fele__"+networkName;
  try{
    const dbStatus = checkIfNetworkExists(database)
    if(dbStatus){
        console.log("Network "+ database+" exists")
        if(channelConfig.includes(".json")) {
          const fileName = USER_WORKSPACE+channelConfig;
          channelConfig = require(fileName);
          channelConfig = JSON.stringify(channelConfig)
        } else {
          channelConfig = channelConfig.replace(/\\/g,'')
        }
        if(jsonSch.includes(".json")) {
          const jsonSchema = USER_WORKSPACE+jsonSch;
          jsonSchema = require(fname);
          jsonSchema = JSON.stringify(jsonSchema);
        }
        else{
          jsonSch = jsonSch.replace(/\\/g,'')
        }
        const valschema = validateSchema(jsonSchema, channelConfig);
        const isValid = valschema['errors'];
        console.log(isValid);
        if (isValid){
          const cconfig = insertToDatabase(database, JSON.parse(channelConfig));
          if (cconfig){
            var dir = "../../../chaincode/"+networkName+"/"+ channelName
            dir = path.join(__dirname, dir)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
                console.log('Directory created.')
                }
            else {
                console.log('Directory already exists.')
                }
            }
       }
        else{
         console.error(valschema.message);
        }
    }
     }catch(error) {
         return false
     }
     return false
 }

 module.exports = {
  createChannel
}
*/
const {createChannel} = require('../../client-api/scripts/channel')
const fs = require('fs');
const path = require("path");
const USER_WORKSPACE = "../../../tmpworkspaceforuser/"

function createChannelCLI(networkName, channelName, channelConfig)
{
  if(channelConfig.includes(".json")) {
      const fileName = USER_WORKSPACE+channelConfig;
      channelConfig = require(fileName);
      channelConfig = JSON.stringify(channelConfig)
    } 
    else {
      channelConfig = channelConfig.replace(/\\/g,'')
    }
    return createChannel(networkName, channelName, JSON.parse(channelConfig));
}

module.exports = {
  createChannelCLI
}