const { createHash } = require('crypto')
const fs = require('fs');
const path = require("path");

const sha256 = (content) => {  
    return createHash('sha256').update(content).digest('hex')
}

const getChannelSelector = (channelName) => {
    return {
        selector: {
            channelName: {
                $eq: channelName
            }
        }     
    }
}

function copyFolderSync(from, to) {
    fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}

module.exports = {
    sha256,
    getChannelSelector,
    copyFolderSync
}