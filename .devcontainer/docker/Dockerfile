# Use codespaces default base container
FROM mcr.microsoft.com/vscode/devcontainers/base:bookworm as base

# Add base software
# - gnupg2: For DevContainer commit signing
RUN apt-get update && \
    apt-get install -y \
        gnupg2  \
    && \
    apt-get clean

# Use base image with common software installed
FROM base

# Add bash_aliases
COPY .bash_aliases /home/vscode/.bash_aliases
