# Chiffchaff Web
**by Kiran Evans**
## Introduction
Chiffchaff is a full-stack application built with the MERN technology stack. The server application was built using *Node.js*, *Express.js* and *MongoDB*; the client application was built using *React*. The application implements *[socket.io](https://socket.io)*, a technology which I used for the first time in this project.

## Purpose
Chiffchaff is an example of an online instant messenger. It allows users to create an account, connect with other users and then chat with them in real time.

## About the Development
I developed the server and client applications simultaneously, using my tried and tested methods developing previous MERN stack apps. Developing the front and back end simultaneously allowed for easy implementation of *socket.io*. The primary reason for which I began this project was to learn how *socket.io* works.

I also chose to manage the entire application's styling and appearance using *[Material UI (MUI)](https://mui.com/)*. I had previously used *MUI* but not to this extent. I taught myself how to create and customise a consistent, mobile-first design system.

## Try it for Yourself
You may clone this repository and use the app if you wish. This project uses *Yarn* as its package manager. Once you have installed the packages for the server and client, you need to configure them.

### Setup Configs

#### Server
In the root directory, create `.env`. This file must contain the following:
```
PORT=
CLIENT_URL=
MONGO_URI=
```
`PORT`
: The port you wish to run the server on. *Integer* e.g. `5000`

`CLIENT_URL`
: The URL of the client app. *String* e.g. `'http://localhost:5173/'`

`MONGO_URI`
: The URI of your *MongoDB* database, including the username and password for the database. *String* e.g. `'mongodb+srv://username:password@cluster0.123abc.mongodb.net/?retryWrites=true&w=majority'`

#### Client
In the `/client/config/` directory, create `.env.development`. This can be in addition to any other *env* files relevant to the mode you choose. See the [Vite website](https://vitejs.dev/guide/env-and-mode.html#modes) for more information. Your *env* file(s) must contain the following:
```
ENV_SERVER_URL=
```
`ENV_SERVER_URL`
: The URL of the server app. *String* e.g. `'http://localhost:3000/'`

### Running the App
To start the server, run the `dev` script using `yarn dev`. To start the client, run the `dev` script in the `/client/` directory.

#### Using the App
1. Visit the client url (e.g. `http://localhost:5173`).
2. Create an account or login. ![Sign up page](/screenshots/signup.png)
3. Find a user to connect with. ![Home page](/screenshots/findusers.png)
4. Connect with a user. ![Search results](/screenshots/search.png)
5. Start chatting. ![Messages](/screenshots/message.png)