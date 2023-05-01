#! /usr/bin/env node
const commander = require('commander')
const { createNetworkCLI, deleteNetworkCLI, useNetworkCLI } = require('./scripts/network')
const { createChaincodeCLI, invokeChaincodeCLI } = require('./scripts/chaincode');
const { createChannelCLI, deleteChannelCLI, addFeleUsersInChannelCLI } = require('./scripts/channel');
const { registerUserCLI, enrollUserCLI } = require('./scripts/ca')
const { createFeleOrgCLI, deleteFeleOrgCLI } = require('../cli/scripts/feleOrg')
const { createOrganizationCLI, addNetworktoLocalOrgCLI, addChannelToNetworkCLI, addLocalUserCLI, deleteLocalUserCLI, getAllLocalUsersCLI, updatePasswordCLI, addCertToWalletCLI, listAllFeleUsersInChannelCLI, getCurrentUserMappingCLI, getAllUserMappingsCLI, addNewMappingCLI, deleteMappingCLI, syncLocalOrgCLI, listAllNetworksinLocalOrgCLI, listAllChannelsInNetworkCLI } = require('./scripts/localOrg')

const readline = require('readline');
const defaultLocalOrg = require('../../conf/localOrg.json');

const { getDocumentByID, getDocumentFromDatabase } = require('../utils/db');
const { authenticateUser } = require('../utils/auth');
const logger = require('../utils/logger');
const { sha256 } = require('../utils/helpers');
const { GLOBAL_STATE } = require('../utils/constants');
const { options } = require('node-forge');

const program = new commander.Command();
const userCommand = program.command('user');
const localOrgsCommand = program.command('localOrgs');

const interpreter = new commander.Command();
const networkCommand = interpreter.command('network');
const chaincodeCommand = interpreter.command('chaincode');
const channelCommand = interpreter.command('channel');
const caCommand = interpreter.command('ca');
const feleOrgCommand = interpreter.command('feleOrg');

/************************CA Register and enroll Commands*********************/
caCommand
    .command('register') 
    .description('Registers a Fele User')
    .option('-id, --id <id>', 'id for the fele user')
    .option('-a, --affiliation <affiliation>', 'id for the fele user') //orgName eg: nasa_artemis
    .action(async(options) => {
        let { enrollmentID, enrollmentSecret } = await registerUserCLI(options.affiliation, options.id);
        
        interpreter.enrollmentID = enrollmentID;
        interpreter.enrollmentSecret = enrollmentSecret;

        console.log("enrollmentID : "+enrollmentID);
        console.log("enrollmentSecret : "+enrollmentSecret);
        //fele user -u preethi -p preethi -o nasa
        //ca register -id admin -a uhcl_artemis
        //ca enroll -id uhcl_artemis.admin -s 3bUR9gy9slAgH0 -m uhcl -n artemis

        //Simulate generating enrollment id that is combination of orgname and user to have nasa_artemis.admin1
        //Simulate generating random password by the ca and giving the enrollment id and password to the user for performing the enroll step
        //Should we add Fele users to the network database?

        //the enrollmentSecret is stored temporarily after registration and deleted
        //when the user finishes enrollment. so we can store details in interpreter object.
    });

caCommand
    .command('enroll') 
    .description('Enroll a Fele User')
    .option('-id, --enrollmentId <enrollmentId>', 'id for the fele user')
    .option('-s, --enrollmentSecret <enrollmentSecret>', 'secret for the fele user')
    .option('-m, --mspId <mspId>', 'secret for the fele user')
    .option('-n, --network <network>', 'name of the network')
    .action(async(options) => {
        //Prepare a csr to send & generate a certificate for the fele user 
        if(interpreter.enrollmentID == options.enrollmentId && interpreter.enrollmentSecret == options.enrollmentSecret) {
            const wallet_id = await enrollUserCLI(options.enrollmentId, options.mspId, options.network);
            console.log("CREDENTIAL ID: ", wallet_id);
            if (wallet_id) console.log(wallet_id)
            else console.log("User cannot be enrolled")
        }else{
            console.log("Credentials Invalid")
        }
    });

/************************FeleOrg Commands*********************/
feleOrgCommand
    .command('create')
    .description('create a fele organization')
    .option('-nn, --networkName <networkName>', 'Name of the network')
    .option('-on, --orgName <orgName>', 'name of fele organiztion')
    .action(async(options) => {
        return createFeleOrgCLI(options.networkName, options.orgName)
    })

feleOrgCommand
    .command('delete')
    .description('delete a fele organization')
    .option('-nn, --networkName <networkName>', 'Name of the network')
    .option('-on, --orgName <orgName>', 'name of fele organiztion')
    .action(async(options) => {
        return deleteFeleOrgCLI(options.networkName, options.orgName)
    })

/************************Network Commands*********************/
networkCommand
    .command('use')
    .description('uses a network that is available')
    .action(async(options) => {
        GLOBAL_STATE.feleUser = await useNetworkCLI(GLOBAL_STATE.localUser.username, GLOBAL_STATE.localOrg, options.networkName);
        // if(GLOBAL_STATE.feleUser.user) GLOBAL_STATE.network = GLOBAL_STATE.feleUser.network.felenetId;
    });

networkCommand
    .command('create')
    .description('Creates a network')
    .option('-nc, --networkConfig <networkConfig>', 'Network config json filename to be passed')
    .action((options) => {
        return createNetworkCLI(options.networkConfig , options.networkName);
    });

networkCommand
    .command('delete')
    .action((options) => {
        return deleteNetworkCLI(options.networkName);
    });

networkCommand
    .command('changeDefault')
    .argument('<newFeleNetwork>', 'New fele network to use')
    .action((newFeleNetwork) => {
        //Set the gateway object to new updated value
    });

networkCommand
    .command('update')
    .action((networkName) => {
        console.log('update subcommand');
    });

networkCommand.commands.forEach((cmd) => {
    cmd.option('-nn, --networkName <networkName>', 'Name of the network')
});

/************************Channel Commands*********************/
channelCommand
    .command('create')
    .option('-cc, --channelConfig <channelConfig>', 'Channel config json filename to be passed')
    .action(async(options) => {
        return createChannelCLI(options.networkName, options.channelConfig);
    })

channelCommand
    .command('delete')
    .option('-cn, --channelName <channelName>', 'Channel name to be passed')
    .action(async(options) => {
        return deleteChannelCLI(options.networkName, options.channelName);
    });

channelCommand
    .command('addFeleUser')
    .option('-cn, --channelName <channelName>', 'Channel name to be passed')
    .option('-on, --orgName <orgName>', 'Name of the organization')
    .option('-fu, --feleUsers <feleUsers>', 'Fele user names')
    .action(async(options) => {
        options.feleUsers = options.feleUsers.replace(/[\[\]"]/g, '');
        let feleUsers = options.feleUsers.split(",")
        return addFeleUsersInChannelCLI(options.networkName, options.channelName, options.orgName, feleUsers);
    });

channelCommand.commands.forEach((cmd) => {
	cmd.option('-nn, --networkName <networkName>', 'Name of the network')
});
//************************Chaincode Commands******************** */
const registerCommand = chaincodeCommand.command('register')

registerCommand
    .command('create')
    .action(options => {
        return createChaincodeCLI(options.networkName, options.channelName, options.chaincodeName)
    })

registerCommand
    .command('update')

registerCommand
    .command('remove')

registerCommand.commands.forEach((cmd) => {
        cmd.option('-nn, --networkName <networkName>', 'Name of the network')
        cmd.option('-cn, --channelName <channelName>', 'Name of the channel')
        cmd.option('-ccn, --chaincodeName <chaincodeName>', 'Name of the chaincode')
    });

chaincodeCommand
    .command('invoke')
    .option('-nn, --networkName <networkName>', 'Name of the network')
    .option('-cn, --channelName <channelName>', 'Name of the channel')
    .option('-ccn, --chaincodeName <chaincodeName>', 'Name of the chaincode')
    .option('-ca, --chaincodeArgument <chaincodeArgument>', 'Argument passed to the chaincode')
    .action(async(options) => {
        var json = options.chaincodeArgument;
        console.log("Chaincode Argument", json);
        json = JSON.parse(json);
        let invokerName = GLOBAL_STATE.feleUser.user
        return invokeChaincodeCLI(options.networkName, options.channelName, invokerName, options.chaincodeName, json); 
    });
    

/************************User Commands*********************/
userCommand
    .option('-o, --mspId <mspId>', 'mspId to be passed')
    .option('-u, --username <username>', 'feleUser to be passed')
    .option('-p, --password <password>', 'password to be passed')
    //Add un, pw and insert to wallet
    .action(async(options) => {
        //authentication
        const hashedPassword = sha256(options.password);
        GLOBAL_STATE.localOrg = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: options.mspId
                }
            }     
        })
        //localOrg gets its value from couchdb or from the default localorg.json file
        GLOBAL_STATE.localOrg = GLOBAL_STATE.localOrg.docs[0] || defaultLocalOrg
        
        GLOBAL_STATE.localUser = authenticateUser(options.username, hashedPassword, options.mspId, GLOBAL_STATE.localOrg)
        
        if(GLOBAL_STATE.localUser.authenticated) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            logger.info("User authenticated successfully!");
            
            const waitForUserInput = () => {
                const gateway = {
                    "feleUser" : GLOBAL_STATE.feleUser.user,
                    "feleNetwork": GLOBAL_STATE.network,
                    "mspId" : options.mspId
                }
                const info = Object.values(gateway).filter(gatewayItems => gatewayItems).join('.');
                const question = `fele [ ${info} ] > `
                rl.question(question, async(command) => {
                    if (command === "quit") {
                        rl.close();
                    } else {
                        const commandArr = command.split(" ");
                        await interpreter.parse(commandArr, { from : 'user'});
                        waitForUserInput();
                    }
                });
            }
            waitForUserInput()
        } else {
            console.log("Authentication Failed. Try again");
            logger.error(`Failed to authenticate username ${options.username}`);
        }
    })

/************************LocalOrg Commands*********************/
localOrgsCommand
    .command('createLocalOrg')
    .option('-oc, --orgConfig <orgConfig>', 'JSON configuration of the local organization')
    .action(async(options) => {
        return await createOrganizationCLI(options.orgConfig);
    })

localOrgsCommand
    .command('addNetworkToLocalOrg')
    .option('-u, --adminUsername <adminUsername>', 'admin username')
    .option('-p, --adminPassword <adminPassword>', 'admin password')
    .option('-ua, --userArgument <userArgument>', 'organization and network names.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        //console.log("User Argument", json);
        return await addNetworktoLocalOrgCLI(options.adminUsername, options.adminPassword, json); 
    });

localOrgsCommand
    .command('addChannelToNetwork')
    .option('-u, --adminUsername <adminUsername>', 'admin username')
    .option('-p, --adminPassword <adminPassword>', 'admin password')
    .option('-ua, --userArgument <userArgument>', 'organization, network and channel names.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        //console.log("User Argument", json);
        return await addChannelToNetworkCLI(options.adminUsername, options.adminPassword, json); 
    });
  
localOrgsCommand
    .command('syncLocalOrg')
    .option('-u, --Username <Username>', 'username')
    .option('-p, --Password <Password>', 'password')
    .option('-o, --organization <organization>', 'organization name')
    .action(async(options) => {
        return await syncLocalOrgCLI(options.Username, options.Password, options.organization);
    })

localOrgsCommand
    .command('listAllNetworksinLocalOrg')
    .option('-u, --Username <Username>', 'username')
    .option('-p, --Password <Password>', 'password')
    .option('-o, --organization <organization>', 'organization name')
    .action(async(options) => {
        return await listAllNetworksinLocalOrgCLI(options.Username, options.Password, options.organization);
    })

localOrgsCommand
    .command('listAllChannelsInNetwork')
    .option('-u, --Username <Username>', 'username')
    .option('-p, --Password <Password>', 'password')
    .option('-o, --organization <organization>', 'organization name')
    .option('-n, --network <network>', 'network name')
    .action(async(options) => {
        return await listAllChannelsInNetworkCLI(options.Username, options.Password, options.organization, options.network);
    })

localOrgsCommand
    .command('addUser')
    .option('-u, --adminUsername <adminUsername>', 'admin username')
    .option('-p, --adminPassword <adminPassword>', 'admin password')
    .option('-ua, --userArgument <userArgument>', 'organization, username, password, role, userDetails details.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        //console.log("User Argument", json);
        return await addLocalUserCLI(options.adminUsername, options.adminPassword, json); 
    });

localOrgsCommand
    .command('deleteUser')
    .option('-u, --adminUsername <adminUsername>', 'admin username')
    .option('-p, --adminPassword <adminPassword>', 'admin password')
    .option('-ua, --userArgument <userArgument>', 'organization and username details.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        //console.log("User Argument", json);
        return await deleteLocalUserCLI(options.adminUsername, options.adminPassword, json); 
    });

localOrgsCommand
    .command('getAllLocalUsers')
    .option('-u, --adminUsername <adminUsername>', 'admin username')
    .option('-p, --adminPassword <adminPassword>', 'admin password')
    .option('-o, --organization <organization>', 'organization name')
    .action(async(options) => {
        return await getAllLocalUsersCLI(options.adminUsername, options.adminPassword, options.organization);
    })

localOrgsCommand
    .command('updatePassword')
    .option('-u, --Username <Username>', 'username')
    .option('-p, --Password <Password>', 'password')
    .option('-o, --organization <organization>', 'organization name')
    .option('-np, --newPassword <newPassword>', 'New Password to be updated')
    .action(async(options) => {
        return await updatePasswordCLI(options.Username, options.Password, options.organization, options.newPassword);
    })

localOrgsCommand
    .command('addCertToWallet')
    .option('-u, --Username <Username>', 'username')
    .option('-p, --Password <Password>', 'password')
    .option('-ua, --userArgument <userArgument>', 'Fele User and Certificate details in JSON format.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        //console.log("User Argument", json);
        return await addCertToWalletCLI(options.Username, options.Password, json);
    }) 

localOrgsCommand
    .command('listAllFeleUsersInChannel')
    .option('-u, --adminUsername <adminUsername>', 'admin username')
    .option('-p, --adminPassword <adminPassword>', 'admin password')
    .option('-ua, --userArgument <userArgument>', 'organization, network, channel.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        //console.log("User Argument", json);
        return await listAllFeleUsersInChannelCLI(options.adminUsername, options.adminPassword, json);
    }) 

localOrgsCommand
    .command('getCurrentUserMapping')
    .option('-u, --Username <adminUsername>', 'username')
    .option('-p, --Password <adminPassword>', 'password')
    .option('-ua, --userArgument <userArgument>', 'organization, network, channel names.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        return await getCurrentUserMappingCLI(options.Username, options.Password, json);
    })

localOrgsCommand
    .command('getAllUserMappings')
    .option('-u, --adminUsername <adminUsername>', 'admin username')
    .option('-p, --adminPassword <adminPassword>', 'admin password')
    .option('-ua, --userArgument <userArgument>', 'organization, network, channel names.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        return await getAllUserMappingsCLI(options.adminUsername, options.adminPassword, json);
    })

localOrgsCommand
    .command('addNewMapping')
    .option('-u, --adminUsername <adminUsername>', 'admin username')
    .option('-p, --adminPassword <adminPassword>', 'admin password')
    .option('-ua, --userArgument <userArgument>', 'organization, fele_network, fele_channel, fele_user and username details.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        return await addNewMappingCLI(options.adminUsername, options.adminPassword, json);
    })

localOrgsCommand
    .command('deleteMapping')
    .option('-u, --adminUsername <adminUsername>', 'admin username')
    .option('-p, --adminPassword <adminPassword>', 'admin password')
    .option('-ua, --userArgument <userArgument>', 'organization, network, channel, username details.')
    .action(async(options) => {
        var json = options.userArgument;
        json = JSON.parse(json);
        return await deleteMappingCLI(options.adminUsername, options.adminPassword, json);
    })



module.exports = {
  program,
  interpreter
}