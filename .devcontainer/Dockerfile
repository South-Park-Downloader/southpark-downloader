# Use codespaces default base container
FROM mcr.microsoft.com/vscode/devcontainers/base:bullseye

# Add gnupg2 for signing commits
RUN apt-get update && apt-get install gnupg2 -y

# Add bash_aliases
COPY .bash_aliases /home/vscode/.bash_aliases
