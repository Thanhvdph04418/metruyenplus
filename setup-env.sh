#!/bin/bash

# Script to setup environment for GitHub Actions SSH
# This ensures the same environment as normal SSH session

# Force interactive shell behavior
export SHELL=/bin/bash
export TERM=xterm-256color

# Load all shell profiles to get complete environment
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
if [ -f ~/.profile ]; then
    source ~/.profile
fi
if [ -f ~/.bash_profile ]; then
    source ~/.bash_profile
fi
if [ -f ~/.zshrc ]; then
    source ~/.zshrc
fi

# Load NVM if available
if [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    nvm use v22.9.0 2>/dev/null || true
fi

# Set up PATH with common Node.js locations
export PATH="/root/.nvm/versions/node/v22.9.0/bin:$PATH"
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
export PATH="/opt/nodejs/bin:$PATH"

# Debug: Show environment info
echo "=== Environment Debug ==="
echo "Node version: $(node --version 2>/dev/null || echo 'Node not found')"
echo "NPM version: $(npm --version 2>/dev/null || echo 'NPM not found')"
echo "Yarn version: $(yarn --version 2>/dev/null || echo 'Yarn not found')"
echo "Current PATH: $PATH"
echo "Current directory: $(pwd)"
echo "========================="

# Execute the command passed as argument
exec "$@"
