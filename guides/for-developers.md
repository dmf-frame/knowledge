# Developer Integration Guide

So you want to integrate dmfUSD into your smart contracts or dApp? Great — let's get you set up. dmfUSD behaves like any standard ERC-20 token with a few extra goodies.

## The Contract Interface

dmfUSD is an ERC-20 token with ERC-4626 vault extensions. It uses 6 decimals (same as USDC), so no weird math when moving between the two.

Here's the minimal interface you'll need:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Minimal dmfUSD interface for integration
interface IDmfUSD {
    // --- User functions ---
    /// @notice Buy dmfUSD with USDC
    /// @param usdcAmount Amount of USDC to spend (6 decimals)
    /// @return dmfAmount Amount of dmfUSD minted
    function buy(uint256 usdcAmount) external returns (uint256);
    
    /// @notice Refund dmfUSD for USDC
    /// @param tokenAmount Amount of dmfUSD to burn
    function refund(uint256 tokenAmount) external;
    
    /// @notice Refund dmfUSD to a specific recipient
    /// @param recipient Address to receive USDC
    /// @param tokenAmount Amount of dmfUSD to burn
    function refundTo(address recipient, uint256 tokenAmount) external;

    // --- View functions ---
    /// @notice Get the backing token (USDC)
    function asset() external view returns (address);
    
    /// @notice Get total USDC reserves (live balance)
    function totalAssets() external view returns (uint256);
    
    /// @notice Get backing per token (6 decimals)
    function getBackingPerToken() external view returns (uint256);

    // --- ERC-4626 Preview functions ---
    function previewDeposit(uint256 assets) external view returns (uint256);
    function previewRedeem(uint256 shares) external view returns (uint256);
    function convertToShares(uint256 assets) external pure returns (uint256);
    function convertToAssets(uint256 shares) external pure returns (uint256);
}
```

## Step 1: Approve USDC Spending

Before calling `buy()`, your user needs to give the dmfUSD contract permission to pull their USDC:

```solidity
IERC20(usdcAddress).approve(dmfUSDAddress, amount);
```

Standard ERC-20 approve. Nothing fancy.

## Step 2: Buy dmfUSD

Once approved, call `buy()`:

```solidity
uint256 usdcAmount = 100_000_000; // 100 USDC (6 decimals)
uint256 dmfAmount = IDmfUSD(dmfUSDAddress).buy(usdcAmount);
// dmfAmount = ~99.75 dmfUSD (100 USDC - 0.25% fee)
```

Want to know what you'll get before you commit? Use the preview function:

```solidity
uint256 estimatedDmf = IDmfUSD(dmfUSDAddress).previewDeposit(usdcAmount);
```

## Step 3: Check Balances and Backing

```solidity
// Check how much dmfUSD someone holds
uint256 balance = IERC20(dmfUSDAddress).balanceOf(userAddress);

// Check the total USDC reserves backing everything (live balance)
uint256 reserves = IDmfUSD(dmfUSDAddress).totalAssets();

// Check backing per token (usually ~1.0048+ USDC per dmfUSD)
uint256 backing = IDmfUSD(dmfUSDAddress).getBackingPerToken();
```

## Step 4: Redeem (Refund) dmfUSD Back to USDC

Ready to cash out? Here's how:

```solidity
uint256 dmfAmount = 100_000_000; // 100 dmfUSD

// Check how much USDC you'll get
uint256 estimatedUsdc = IDmfUSD(dmfUSDAddress).previewRedeem(dmfAmount);

// Send USDC back to yourself
IDmfUSD(dmfUSDAddress).refund(dmfAmount);

// Or send USDC to a different address
IDmfUSD(dmfUSDAddress).refundTo(receiverAddress, dmfAmount);
```

No extra approval needed for refunds — the dmfUSD gets burned straight from your balance.

## Step 5: LiFi Composer Integration (Advanced)

If you're routing cross-chain swaps through LiFi Composer, use `buyFromComposer`:

```solidity
// buyFromComposer (only the registered LiFi Composer can call this)
function buyFromComposer(address buyer, uint256 usdcAmount)
    external onlyComposer nonReentrant returns (uint256);
```

Regular users calling `buyFromComposer()` will get an `OnlyComposer()` error — that function is reserved for the LiFi pipeline.

**Note:** The ERC-4626 `deposit()` and `redeem()` functions are **not** Composer-only. They are public (guarded only by `nonReentrant`). Anyone can call them.

To register the LiFi Composer address:
```solidity
IDmfUSD(dmfUSDAddress).setComposer(composerAddress);
```
Only the contract owner can call this.

## Events to Watch For

```solidity
event Buy(address indexed user, uint256 usdcAmount, uint256 dmfAmount, uint256 fee);
event Refund(address indexed user, uint256 tokenAmount, uint256 usdcAmount);
event Deposit(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);
event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 shares, uint256 assets);
```

## Common Errors (and What They Mean)

| Error | What Went Wrong |
|---|---|
| `InvalidAddress()` | You passed a zero address somewhere |
| `InvalidAmount()` | You passed zero as the amount |
| `OnlyComposer()` | Someone other than the LiFi Composer tried buyFromComposer |
| `OnlyOwner()` | A non-owner tried an admin function |
| Revert on approve | Not enough USDC approved |
| Revert on buy | Fee eats more than the remaining balance |

## Quick Reference

```
dmfUSD chain: Base (chain ID 8453 or 84532)
dmfUSD decimals: 6
USDC (Base): 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
USDC (Base Sepolia): 0x036CbD53842c5426634e7929541eC2318f3dCF7e
```
