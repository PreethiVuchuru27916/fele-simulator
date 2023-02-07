#! /usr/bin/env node
const commander = require('commander')
const { createNetworkCLI, deleteNetworkCLI } = require('./scripts/network')
const { createChaincode } = require('./scripts/chaincode');
const { createChannel } = require('./scripts/channel');

const readline = require('readline');

const program = new commander.Command();
const userCommand = program.command('user');

const interpreter = new commander.Command();
const networkCommand = interpreter.command('network');
const chaincodeCommand = interpreter.command('chaincode');
const channelCommand = interpreter.command('channel');

/************************Network Commands*********************/
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
    .option('-nn, --networkName <networkName>', 'Name of the network')
    .option('-cn, --channelName <channelName>', 'Name of the channel')
    .action((options) => {
        return createChannel(options.networkName, options.channelName)
    })
//************************Chaincode Commands******************** */
const registerCommand = chaincodeCommand.command('register')

registerCommand
    .command('create')
    .action(options => {
        return createChaincode(options.networkName, options.channelName, options.chaincodeName)
    })

registerCommand
    .command('update')

registerCommand
    .command('delete')

registerCommand.commands.forEach((cmd) => {
        cmd.option('-nn, --networkName <networkName>', 'Name of the network')
        cmd.option('-cn, --channelName <channelName>', 'Name of the channel')
        cmd.option('-ccn, --chaincodeName <chaincodeName>', 'Name of the chaincode')
    });

/************************Chaincode Commands*********************/
chaincodeCommand
    .command('invoke')
    // .option('-cn, --channelName <channelName>', 'Name of the channel')
    // .option('-ccn, --chaincodeName <chaincodeName>', 'Name of the chaincode')
    .argument('<args...>', 'arguments to the chaincode')
    .action((args) => {
        args.forEach((arg) => {
            console.log(arg);
            console.log(typeof arg);
        });
    });

/************************User Commands*********************/
userCommand
    .option('-o, --mspId <mspId>', 'mspId to be passed')
    .option('-u, --feleUser <feleUser>', 'feleUser to be passed')
    .option('-p, --password <password>', 'password to be passed')
    .option('-n, --feleNetwork <feleNetwork>', 'Default feleNetwork name to be passed')
    //Add un, pw and insert to wallet
    .action((options) => {
        //authentication
        let Gateway = {
            "mspId" : [options.mspId],
            "feleUser" : [options.feleUser],
            "feleNetwork" : [options.feleNetwork]
        }
        
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        let waitForUserInput = () => {
            rl.question("fele [ "+Gateway.feleNetwork+"."+ Gateway.mspId+"."+Gateway.feleUser+" ] > ",  function(command) {
            if (command == "quit"){
                rl.close();
            } else {
                console.log("command entered is "+command)
                var commandArr = command.split(" ");
                interpreter.parse(commandArr, { from : 'user'});
                waitForUserInput()
            }
            });
        }
        waitForUserInput()
    })

module.exports = {
    program,
    interpreter
}