# ZoneX - Decentralized Exchange (DEX)

ZoneX is a fully decentralized exchange (DEX) inspired by concepts in the Uniswap V3 ecosystem, designed for secure, trustless, and efficient trading on the blockchain. With ZoneX, users can swap tokens, provide liquidity, and engage in automated market making. It’s optimized for fast transactions, minimal gas fees, and a high level of security.

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Smart Contract Overview](#smart-contract-overview)
- [Installation & Testing](#installation--testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Token Swapping**: Swap between tokens in a decentralized and trustless environment.
- **Liquidity Provisioning**: Users can provide liquidity and earn a share of fees generated from swaps.
- **Automated Market Making (AMM)**: ZoneX uses an AMM model, eliminating the need for traditional order books.
- **Fee Calculation**: Efficient fee calculation based on liquidity and trade volume, with optimized gas usage.
- **Security First**: Smart contracts are audited, tested, and optimized for security.

---

## How It Works

ZoneX leverages Uniswap V3-inspired mechanics with added optimizations for fee calculation and liquidity management. Key components include:

1. **Liquidity Pools**: Each token pair has its own pool where users can deposit assets to provide liquidity and earn trading fees.
2. **Ticks & Price Ranges**: ZoneX supports fine-grained control of liquidity across price ranges, allowing liquidity providers to target specific ranges for optimized earnings.
3. **Fee Growth Tracking**: The system tracks fee accumulation per liquidity unit globally and by tick, ensuring efficient fee distribution without gas-heavy recalculations.

---

## Smart Contract Overview

### Core Contracts

- **ZoneX.sol**: The main contract for managing swaps, liquidity, and fee distribution.
- **LiquidityPool.sol**: Handles liquidity provisioning, allowing users to deposit and withdraw tokens from specific pools.
- **FeeManager.sol**: Calculates and tracks fees generated within each tick range, updating only when prices cross these ranges to optimize gas usage.

### Key Variables

- **feeGrowthGlobal0X128** & **feeGrowthGlobal1X128**: Track global fees per unit of liquidity for each token.
- **tickBitmap**: Records the price range within which a position has accumulated fees.
- **mask**: Used to toggle specific tick positions within a word, optimizing storage and gas.

---

## Installation & Testing

### Prerequisites

- **Foundry**: To set up a local Ethereum environment and perform tests

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/zonex-dex.git
   cd zonex-dex
   ```

2. \*\*Install dependencies

   ```bash
   forge install
   ```

3. \*\*Compile the contracts

   ```bash
   forge build
   ```

4. \*\*Run tests

   ```bash
   forge test
   ```

5. \*\*Deploying
   ```bash
   make deploy
   ```

## Learning Resources

ZoneX was developed with foundational concepts from the (Uniswap V3 book)[https://uniswapv3book.com/], incorporating Uniswap’s advanced AMM model, tick management, and efficient fee structures to create an optimized DEX solution.

## Contributing

We welcome contributions to improve ZoneX. Please feel free to submit issues or open pull requests.

1. Fork the repository
2. Clone the forked repository
3. Create a new branch for your feature or bugfix
4. Commit and push your changes
5. Create a pull request to the main repository

## License

- ZoneX is released under the MIT License.
