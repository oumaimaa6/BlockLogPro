import express from 'express';
import cors from 'cors';
import { ethers, JsonRpcProvider, Wallet, Contract } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Load deployment info.
// We expect deployments.json to be in the parent directory (iob/deployments.json)
// or copied to server directory. Let's try to read from parent for now or fallback.
const DEPLOYMENT_PATH = path.join(__dirname, './deployments.json');

// Hardhat local node
const RPC_URL = "http://127.0.0.1:8545";

// Default Hardhat Account #0 Private Key
// In production, this should be in .env
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

let contract;

async function init() {
    if (!fs.existsSync(DEPLOYMENT_PATH)) {
        console.error("Deployments file not found at", DEPLOYMENT_PATH);
        return;
    }

    const deploymentData = JSON.parse(fs.readFileSync(DEPLOYMENT_PATH, 'utf-8'));
    const provider = new JsonRpcProvider(RPC_URL);
    const wallet = new Wallet(PRIVATE_KEY, provider);

    contract = new Contract(deploymentData.address, deploymentData.abi, wallet);
    console.log("Connected to LogStorage at", deploymentData.address);
}

app.post('/api/logs', async (req, res) => {
    try {
        const { source, message, status } = req.body;
        if (!source || !message) {
            return res.status(400).json({ error: "Missing source or message" });
        }

        const logStatus = status || "INFO"; // Default to INFO if not provided

        if (!contract) {
            return res.status(503).json({ error: "Blockchain not connected" });
        }

        console.log(`Writing log from ${source} [${logStatus}]: ${message}`);
        const tx = await contract.addLog(source, message, logStatus);
        console.log("Transaction sent:", tx.hash);

        // Wait for confirmation
        const receipt = await tx.wait();

        res.json({ success: true, txHash: tx.hash, blockNumber: receipt.blockNumber });
    } catch (error) {
        console.error("Error writing to blockchain:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/logs', async (req, res) => {
    try {
        if (!contract) {
            // If contract not initialized, try to init (maybe deployment happened late)
            await init();
            if (!contract) return res.status(503).json({ error: "Blockchain not connected" });
        }

        // We can also just read from the contract
        const logs = await contract.getLogs();
        // logs is an array of structs. Convert to JSON friendly format
        const formattedLogs = logs.map(log => ({
            timestamp: Number(log.timestamp),
            source: log.source,
            message: log.message,
            status: log.status
        }));

        res.json(formattedLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Initialize and start
init().then(() => {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
});
