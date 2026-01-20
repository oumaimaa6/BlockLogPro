const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const LogStorage = await hre.ethers.getContractFactory("LogStorage");
    const logStorage = await LogStorage.deploy();

    await logStorage.waitForDeployment();
    const address = await logStorage.getAddress();

    console.log("LogStorage deployed to:", address);

    const artifact = await hre.artifacts.readArtifact("LogStorage");
    const deploymentData = {
        address: address,
        abi: artifact.abi
    };

    const data = JSON.stringify(deploymentData, null, 2);
    fs.writeFileSync(path.join(__dirname, "../deployments.json"), data);

    // Copy to client and server
    const clientPath = path.join(__dirname, "../../client/src/deployments.json");
    const serverPath = path.join(__dirname, "../../server/deployments.json");

    fs.writeFileSync(clientPath, data);
    fs.writeFileSync(serverPath, data);

    console.log(`Config copied to:\n  ${clientPath}\n  ${serverPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
