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

# Install latest version of YouTube-DL(P)
RUN curl -L \
    https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    --output /usr/local/bin/youtube-dl && \
    chmod +x /usr/local/bin/youtube-dl

# Install custom FFMPEG build for YouTube-DL(P)
RUN mkdir ffmpeg-download && \
    curl -L https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz --output ffmpeg-download/ffmpeg.tar.xz && \
    tar -xf ffmpeg-download/ffmpeg.tar.xz --strip 1 -C ffmpeg-download && \
    mv ffmpeg-download/bin/* /usr/local/bin/ && \
    rm -R ffmpeg-download
