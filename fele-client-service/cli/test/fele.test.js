const {program} = require('../commands');
const inputComm = require('../test/fele.input');
const outputComm = require('../test/fele.output');
const {interpreter} = require('../commands');

describe('test cases',() => {
  it('executes or not', () => {
    const comm = 'user -o nasa -u admin -p admin1234# -n artemis'
    program.parse(comm.split(" "), {from : 'user'});
    const comm1 = inputComm.input[0];
    //const comm1 = 'network delete -nn artemis'
    const result = interpreter.parse(comm1.split(" "), {from : 'user'});
    console.log(result)
    //console.log(typeof result)
    console.log(outputComm.output)
    //const res=JSON.stringify(result);
    expect(result).toBe(outputComm.output);
  })
})
