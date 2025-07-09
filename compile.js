import fs from 'fs/promises';
import path from 'path';
import solc from 'solc';
import { fileURLToPath } from 'url';

// Determine __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Solidity contract file
const contractPath = path.resolve(__dirname, 'SimpleToken.sol');

// Read the contract file asynchronously and compile it
async function compileContract() {
    try {
        const source = await fs.readFile(contractPath, 'utf8');

        // Set up the Solidity compiler input in standard JSON format
        const input = {
            language: 'Solidity',
            sources: {
                'SimpleToken.sol': {
                    content: source
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode']
                    }
                }
            }
        };

        // Compile the contract
        const output = JSON.parse(solc.compile(JSON.stringify(input)));

        // Check and log any compilation errors
        if (output.errors) {
            output.errors.forEach((error) => {
                console.error(error.formattedMessage);
            });
        }

        // Loop through the compiled contracts and write ABI and bytecode to files
        for (const contractName in output.contracts['SimpleToken.sol']) {
            const contract = output.contracts['SimpleToken.sol'][contractName];
            const abi = contract.abi;
            const bytecode = contract.evm.bytecode.object;

            // Write ABI to a JSON file
            await fs.writeFile(
                path.resolve(__dirname, `${contractName}ABI.json`),
                JSON.stringify(abi, null, 2)
            );

            // Write bytecode to a text file
            await fs.writeFile(
                path.resolve(__dirname, `${contractName}Bytecode.txt`),
                bytecode
            );

            console.log(`Compiled ${contractName}: ABI and Bytecode generated.`);
        }
    } catch (error) {
        console.error('Failed to read contract or compile:', error);
    }
}

// Execute the compilation
compileContract();
