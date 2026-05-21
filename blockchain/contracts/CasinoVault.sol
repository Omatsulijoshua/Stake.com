// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CasinoVault
 * @dev Secure vault for managing casino deposits and withdrawals.
 */
contract CasinoVault is Ownable, ReentrancyGuard {
    event Deposit(address indexed user, uint256 amount, string currency);
    event Withdrawal(address indexed user, uint256 amount, string currency, bytes32 requestId);

    mapping(bytes32 => bool) public processedWithdrawals;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Deposit ETH into the casino.
     */
    function depositETH() external payable {
        require(msg.value > 0, "Amount must be > 0");
        emit Deposit(msg.sender, msg.value, "ETH");
    }

    /**
     * @dev Deposit ERC20 tokens (e.g., USDT).
     */
    function depositToken(address token, uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount, "TOKEN");
    }

    /**
     * @dev Withdraw ETH (Admin only, after approval).
     */
    function withdrawETH(address payable to, uint256 amount, bytes32 requestId) external onlyOwner nonReentrant {
        require(!processedWithdrawals[requestId], "Withdrawal already processed");
        require(address(this).balance >= amount, "Insufficient vault balance");
        
        processedWithdrawals[requestId] = true;
        to.transfer(amount);
        
        emit Withdrawal(to, amount, "ETH", requestId);
    }

    /**
     * @dev Withdraw ERC20 tokens (Admin only).
     */
    function withdrawToken(address token, address to, uint256 amount, bytes32 requestId) external onlyOwner nonReentrant {
        require(!processedWithdrawals[requestId], "Withdrawal already processed");
        
        processedWithdrawals[requestId] = true;
        IERC20(token).transfer(to, amount);
        
        emit Withdrawal(to, amount, "TOKEN", requestId);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, "ETH");
    }
}
