import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { ethers, JsonRpcProvider } from 'ethers';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Determine __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    // Read the contract ABI and bytecode generated from the compile step.
    const abi = JSON.parse(readFileSync(resolve(__dirname, 'SimpleTokenABI.json'), 'utf8'));
    const bytecode = readFileSync(resolve(__dirname, 'SimpleTokenBytecode.txt'), 'utf8').trim();

    // Connect to the Ethereum node using the RPC URL from your .env file.
    const provider = new JsonRpcProvider(process.env.RPC_URL);

    // Create a wallet instance using your private key and connect it to the provider.
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Deploying contract using account:", wallet.address);

    // Create a ContractFactory for deployment.
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Set your desired initial supply. For example, 1000 tokens (with 18 decimals).
    // Note: ethers v6 uses `parseUnits` from ethers for conversion.
    const initialSupply = ethers.parseUnits("1000", 18);

    // Deploy the contract.
    const contract = await factory.deploy(initialSupply);
    console.log("Waiting for the contract deployment transaction to be mined...");
    await contract.waitForDeployment();
    console.log(`Contract deployed at: https://sepolia.basescan.org/address/${contract.target}`)
}

main().catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
});
