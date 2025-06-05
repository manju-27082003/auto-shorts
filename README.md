# Auto Shorts 🎥🚀

![GitHub release](https://img.shields.io/github/release/manju-27082003/auto-shorts.svg)
![GitHub issues](https://img.shields.io/github/issues/manju-27082003/auto-shorts.svg)
![GitHub forks](https://img.shields.io/github/forks/manju-27082003/auto-shorts.svg)
![GitHub stars](https://img.shields.io/github/stars/manju-27082003/auto-shorts.svg)

Welcome to **Auto Shorts**, an automated AI-powered space video generator. This project leverages various technologies to create engaging space-themed videos and publish them daily on YouTube. 

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)
8. [Links](#links)

## Introduction

In an age where content is king, **Auto Shorts** provides a seamless solution for generating space-related videos using cutting-edge AI technology. With tools like Node.js, Remotion, and various APIs, you can automate the video creation process. 

This project fetches data from NASA's Astronomy Picture of the Day (APOD) API, synthesizes audio using AWS Polly and AssemblyAI, and composes visually stunning videos. You can find the latest releases of the project [here](https://github.com/manju-27082003/auto-shorts/releases).

## Technologies Used

**Auto Shorts** integrates several technologies to deliver its functionality:

- **Node.js**: A JavaScript runtime that allows you to build scalable applications.
- **Remotion**: A framework for creating videos programmatically using React.
- **Gemini API**: A service for retrieving space-related data.
- **AWS Polly**: Converts text to lifelike speech.
- **AssemblyAI**: Provides speech recognition and transcription services.
- **NASA APOD API**: Fetches the Astronomy Picture of the Day.

## Features

- **Automated Video Creation**: Generate videos daily without manual intervention.
- **AI-Powered Narration**: Use AWS Polly for natural-sounding voiceovers.
- **Dynamic Content**: Fetch daily space images and information from NASA's APOD API.
- **Seamless YouTube Integration**: Automatically publish videos to your YouTube channel.
- **Docker Support**: Run the application in a containerized environment.

## Installation

To get started with **Auto Shorts**, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/manju-27082003/auto-shorts.git
   cd auto-shorts
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your API keys and configuration settings. Example:
   ```
   NASA_API_KEY=your_nasa_api_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Run the application**:
   ```bash
   npm start
   ```

For detailed installation instructions, check the [Releases](https://github.com/manju-27082003/auto-shorts/releases) section.

## Usage

Once the application is running, it will automatically generate a new video each day. Here’s how it works:

1. **Fetch Daily Data**: The application retrieves the Astronomy Picture of the Day from NASA's API.
2. **Generate Audio**: The description is converted into speech using AWS Polly.
3. **Create Video**: Remotion composes the video using the fetched image and audio.
4. **Publish to YouTube**: The video is uploaded to your YouTube channel.

You can customize various settings in the `.env` file to suit your needs.

## Contributing

We welcome contributions! If you want to help improve **Auto Shorts**, please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Create a pull request.

Your contributions help make this project better for everyone.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Links

For more information, visit the following resources:

- [GitHub Releases](https://github.com/manju-27082003/auto-shorts/releases)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Remotion Documentation](https://www.remotion.dev/docs)
- [AWS Polly Documentation](https://aws.amazon.com/polly/)
- [AssemblyAI Documentation](https://docs.assemblyai.com/)
- [NASA APOD API Documentation](https://api.nasa.gov/)

Explore the potential of automated video generation with **Auto Shorts**. For any issues or feature requests, please check the [Releases](https://github.com/manju-27082003/auto-shorts/releases) section or open an issue in the repository.