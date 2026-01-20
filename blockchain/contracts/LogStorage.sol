// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LogStorage {
    struct LogEntry {
        uint256 timestamp;
        string source;
        string message;
        string status;
    }

    LogEntry[] public logs;

    event LogAdded(uint256 timestamp, string source, string message, string status);

    function addLog(string memory _source, string memory _message, string memory _status) public {
        logs.push(LogEntry(block.timestamp, _source, _message, _status));
        emit LogAdded(block.timestamp, _source, _message, _status);
    }

    function getLogs() public view returns (LogEntry[] memory) {
        return logs;
    }

    function getLogCount() public view returns (uint256) {
        return logs.length;
    }
}
