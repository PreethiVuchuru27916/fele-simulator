const { program, interpreter } = require("../fele-client-service/cli/command");
const { GLOBAL_STATE } = require("../fele-client-service/utils/constants");

describe('test cases',() => {
  it('executes or not', async() => {
    const comm = 'user -u preethi -p preethi -o nasa';
    const login = await program.parseAsync(comm.split(" "), {from : 'user'});
    const comm1 = 'network use -nn artemis';
    const networkUse = await interpreter.parseAsync(comm1.split(" "), {from : 'user'});
    
    console.log(GLOBAL_STATE);
    expect(GLOBAL_STATE.feleUser.network.felenetId).toBe("artemis");
  })
})