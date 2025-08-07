#!/bin/bash

# Kill all next-server processes running in the yieldmap directory
for pid in $(pgrep -f "next-server" -u cosmos 2>/dev/null || true); do
    if pwdx "$pid" 2>/dev/null | grep -q "/home/cosmos/yieldmap"; then
        echo "Killing yieldmap next-server process: $pid"
        kill -9 "$pid" 2>/dev/null || true
    fi
done

# Also kill any npm processes in yieldmap directory
for pid in $(pgrep -f "npm start" -u cosmos 2>/dev/null || true); do
    if pwdx "$pid" 2>/dev/null | grep -q "/home/cosmos/yieldmap"; then
        echo "Killing yieldmap npm process: $pid"
        kill -9 "$pid" 2>/dev/null || true
    fi
done

sleep 1
exit 0 