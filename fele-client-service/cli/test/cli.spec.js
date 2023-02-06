#! /usr/bin/env node
const commander = require('commander');
const DEBUG = false; // change to true to see logs
const {createNetworkCLI} = require('../scripts/network')
const {deleteNetworkCLI} = require('../scripts/network')
const {createChannel} = require('../scripts/channel')
const {createChaincode} = require('../scripts/chaincode')
const {interpreter} = require('../commands')
// just a user defined function to help view logs
const log = (value) => {
  if (DEBUG) {
    console.log("--------------------------------------------");
    console.log(value);
    console.log("--------------------------------------------");
  }
}
jest.mock('../scripts/network')
jest.mock('../scripts/channel')
jest.mock('../scripts/chaincode')
describe('user program test cases', () => {
  const userProgram = () => { // This is just a temp solution. This function has to be imported from fele.js so there is no redundency and also can be tested for all scenarios
    const program = new commander.Command();
    program
      .command('user')
      .option('--feleNetwork <feleNetwork>', 'Default feleNetwork name to be passed')
      .action(() => {});
    return program;
  }
  
  test('COMMANDER CMD TEST for creating a network', async () => {
    //console.log({...network })
    const commandArr = [
        'network',
        'create',
        '-nn',
        'artemis',
        '-nc',
        'state_felenet_gateway_v0_1.json'
      ]
    
    interpreter.parse(commandArr, { from : 'user'});
    expect(createNetworkCLI).toHaveBeenCalledTimes(1)
    
  })
  test('COMMANDER CMD TEST for creating a network', async () => {
    //console.log({...network })
    const commandArr = [
        'network',
        'create',
        '-nn',
        'gg',
        '-nc',
        '{"_id":"state.fele.felenet~root","fmt":"felenet","fmId":"root","includeLedger":false,"transactionAware":false,"blockAware":false,"timestamping":false,"walletUnaware":false}'  
        
      ]
    interpreter.parse(commandArr, { from : 'user'});
    expect(createNetworkCLI).toHaveBeenCalledTimes(2)

  })

  test('COMMANDER CMD TEST for deleting a network', async () => {
    //console.log({...network })
    const commandArr = [
        'network',
        'delete',
        '-nn',
        'artemis'
      ]
    interpreter.parse(commandArr, { from : 'user'});
    expect(deleteNetworkCLI).toHaveBeenCalledTimes(1)

  })

  test('COMMANDER CMD TEST for creating a channel', async () => {
    //console.log({...network })
    const commandArr = [
        'channel',
        'create',
        '-nn',
        'artemis',
        '-cn',
        'nasa'
      ]
    interpreter.parse(commandArr, { from : 'user'});
    expect(createChannel).toHaveBeenCalledTimes(1)

  })
  
 
 
  test('COMMANDER CMD TEST for creating a chaincode', async () => {
    //console.log({...network })
    const commandArr = [
        'chaincode',
        'register',
        'create',
        '-nn',
        'artemis',
        '-cn',
        'nasa',
        'ccn',
        'assests'
      ]
    interpreter.parse(commandArr, { from : 'user'});
    expect(createChaincode).toHaveBeenCalledTimes(1)

  })

  test('COMMANDER CMD TEST for creating a chaincode', async () => {
    //console.log({...network })
   const commandArr = [
        'chaincode',
        'register',
        'create',
        '--networkName',
        'artemis',
        '--channelName',
        'nasa',
        '--chaincodeName',
        'assests'
      ]
    interpreter.parse(commandArr, { from : 'user'});
    expect(createChaincode).toHaveBeenCalledTimes(2)

  })

  test('user command with no options', () => {  
    const program = userProgram();
    program.parse(['node', '../fele-client-service/cli/fele.js', 'user']);
    log(program.args); // just for debugging
    expect(program.args).toEqual(['user']);
    expect(program.args.length).toBeGreaterThan(0);
    expect(program.args.length).toEqual(1);
  })

  test('user command with network option', () => {  
    const program = userProgram();
    program.parse(['node', '../fele-client-service/cli/fele.js', 'user', '--feleNetwork', 'art']);
    log(program.args); // just for debugging
    expect(program.args).toEqual(['user', '--feleNetwork', 'art']);
    expect(program.args.length).toBeGreaterThan(0);
    expect(program.args.length).toEqual(3);
  })
})
