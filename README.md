# Live Streaming Essential Kit

This project is the essential kit template designed to get you quickly building a live streaming website with InLive service.

## Use the template

### GitHub template

[Create a new repository using this essential kit template on GitHub.](https://github.com/inlivedev/live-streaming-essential-kit/generate)

### Fork this repository

[Fork this repository on GitHub.](https://github.com/inlivedev/live-streaming-essential-kit/fork)

### Clone to local

If you prefer to clone this project [using git](https://git-scm.com) to your local machine.

```bash
$ git clone https://github.com/inlivedev/live-streaming-essential-kit.git
```

## Getting started

### Setting the environment variables

This project uses environment variables to set and store sensitive data on different environments. You need to configure the environment variables first to ensure the project is working properly.

Move to the project directory, create a new `.env` file and copy the values from the `.env.example` file.

```bash
$ cd live-streaming-essential-kit
$ cp .env.example .env
```

#### Get the API Key
To get the InLive API key, you need to [register an InLive account](https://studio.inlive.app). Follow [this document](https://inlive.app/docs/getting-started) for more information.

### Install the dependencies

Inside the project directory, install the dependencies. Note that you need to have [node.js and npm](https://nodejs.org/en/) already installed on your machine.

```bash
$ npm install
```

### Running the development

After the dependencies are installed, you are ready to start running the project in development mode using the command below.

```bash
$ npm run dev
```
