FROM node:22-bookworm-slim

# Install Chrome dependencies and build tools
RUN apt-get update && apt-get install -y \
  libnss3 \
  libdbus-1-3 \
  libatk1.0-0 \
  libgbm-dev \
  libasound2 \
  libxrandr2 \
  libxkbcommon-dev \
  libxfixes3 \
  libxcomposite1 \
  libxdamage1 \
  libatk-bridge2.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  libcups2 \
  curl \
  g++ \
  make \
  cmake \
  python3 \
  unzip \
  autoconf \
  automake \
  libtool \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Install AWS Lambda Runtime Interface Client (requires cmake)
RUN npm install aws-lambda-ric

# Ensure Chrome is installed for Remotion
RUN npx remotion browser ensure

# Set the entry point and command for AWS Lambda
ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD ["render.handler"]





# FROM node:22-bookworm-slim
# # Install Chrome dependencies
# RUN apt-get update
# RUN apt install -y \
#   libnss3 \
#   libdbus-1-3 \
#   libatk1.0-0 \
#   libgbm-dev \
#   libasound2 \
#   libxrandr2 \
#   libxkbcommon-dev \
#   libxfixes3 \
#   libxcomposite1 \
#   libxdamage1 \
#   libatk-bridge2.0-0 \
#   libpango-1.0-0 \
#   libcairo2 \
#   libcups2
# # Copy everything from your project to the Docker image. Adjust if needed.
# # COPY package.json package*.json tsconfig.json* remotion.config.* token.json client_secret.json youtube-creds.json .env .gitignore ./
# # COPY src ./src
# # # If you have a public folder:
# # COPY public ./public    

# # COPY components ./components

# # COPY out ./out
# COPY . .
# # Install the right package manager and dependencies - see below for Yarn/PNPM
# RUN npm i
# # Install Chrome
# RUN npx remotion browser ensure
# # Run your application
# COPY render.js render.js
# CMD ["node", "render.js"]