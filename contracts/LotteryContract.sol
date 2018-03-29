pragma solidity ^0.4.18;

contract LotteryContract{
    address public manager;
    address[] public players;

    function LotteryContract() public{
        manager = msg.sender;
    }

    modifier requireEther(){
        require(msg.value > .01 ether);
        _;
    }

    modifier ownerOnly(){
        require(msg.sender == manager);
        _;
    }
    function enter() payable requireEther public {
        players.push(msg.sender);
    }

    function pickWinner() payable ownerOnly public{
      uint index = random() % players.length;
      players[index].transfer(this.balance);
      players = new address[](10);
    }

    function random() public view returns(uint){
      return uint(keccak256(block.difficulty, now, players));
    }

    function getPlayers() public view returns(address[]){
        return players;
    }
}
