########
# Base #
########
FROM node:lts-alpine as base

# Install required software using the package manager
RUN apk add --no-cache curl

####################################
# Dependencies / External software #
####################################
FROM base as dependencies

# Install latest version of YouTube-DL(P)
RUN curl -L \
    https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    --output /usr/local/bin/youtube-dl

# Install custom FFMPEG build for YouTube-DL(P)
RUN mkdir ffmpeg-download && \
    curl -L https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz --output ffmpeg-download/ffmpeg.tar.xz && \
    tar -xf ffmpeg-download/ffmpeg.tar.xz --strip 1 -C ffmpeg-download && \
    mv ffmpeg-download/bin/* /usr/local/bin/ && \
    rm -R ffmpeg-download

# Create application diectory
RUN mkdir /app

# Set working directory of the image to the application directory
WORKDIR /app

# Download by default
CMD [ "download" ]

###############
# Development #
###############
FROM dependencies as development

# Mount the local build
VOLUME /app

# Run the application in dev
ENTRYPOINT [ "node", "/app/build/index.js" ]

##############
# Production #
##############
FROM dependencies as production

# Add the local build
COPY dist /app

# Run the application in pord
ENTRYPOINT [ "node", "/app/index.js" ]