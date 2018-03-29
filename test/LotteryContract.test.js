const ganache = require('ganache-cli');
const Web3 = require('web3');
const assert = require('assert');
const {interface, bytecode} = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let contract;

beforeEach(async () =>{
accounts = await web3.eth.getAccounts();
contract = await new web3.eth.Contract(JSON.parse(interface))
.deploy({data: bytecode, arguments:[]})
.send({from: accounts[0], gas:1000000});

contract.setProvider(provider);
});

describe('Verify Lottery contract methods', () => {
  it('Verify deployment', () =>{
    assert.ok(contract.options.address);
  });

  it('Verify minimum ether to enter to lottery pool', async () => {
    try{
      await contract.methods.enter().send({from:accounts[1], value: 10, gas:1000000});
      assert(false);
    }catch(error){
      assert(error)
    }
  });

  it('Verify adding players to Lottery pool ', async () => {
     const trans = await contract.methods.enter().send({
       from:accounts[1],
       gas:1000000,
       value: web3.utils.toWei('0.012', 'ether')
     });

    const trans1 = await contract.methods.enter().send({
      from:accounts[2],gas:1000000,value:  web3.utils.toWei('0.013', 'ether')});

     const players = await contract.methods.getPlayers().call()
     assert.equal(2, players.length);
     assert.equal(players[0], accounts[1]);
     assert.equal(players[1], accounts[2]);
  });

  it('Only manager can call pick winner method ', async () => {
    try{
      await contract.methods.pickWinner().send({from: accounts[1], gas:500000000});
      assert(false);
    }catch(error){
      assert(error);
    }
  });

  it('Picks winner and transfer money', async () => {
    const trans = await contract.methods.enter().send({
      from:accounts[1],
      gas:1000000,
      value: web3.utils.toWei('2', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await contract.methods.pickWinner().send({from:accounts[0], gas:1000000});
    const finalBalance = await web3.eth.getBalance(accounts[1]);

    const difference = finalBalance - initialBalance;
    assert.equal(difference, web3.utils.toWei('2.0', 'ether'));
  });
});
