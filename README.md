# Covey.Town - Team 6L

Covey.Town provides a virtual meeting space where different groups of people can have simultaneous video calls, allowing participants to drift between different conversations, just like in real life.
Covey.Town was built for Northeastern's [Spring 2021 software engineering course](https://neu-se.github.io/CS4530-CS5500-Spring-2021/), and is designed to be reused across semesters.
You can view our reference deployment of the app at [app.covey.town](https://app.covey.town/) - this is the version that students built on, and our [project showcase](https://neu-se.github.io/CS4530-CS5500-Spring-2021/project-showcase) highlights select projects from Spring 2021.

![Covey.Town Architecture](docs/covey-town-architecture.png)

The figure above depicts the high-level architecture of Covey.Town.
The frontend client (in the `frontend` directory of this repository) uses the [PhaserJS Game Library](https://phaser.io) to create a 2D game interface, using tilemaps and sprites.
The frontend implements video chat using the [Twilio Programmable Video](https://www.twilio.com/docs/video) API, and that aspect of the interface relies heavily on [Twilio's React Starter App](https://github.com/twilio/twilio-video-app-react). Twilio's React Starter App is packaged and reused under the Apache License, 2.0.

A backend service (in the `services/townService` directory) implements the application logic: tracking which "towns" are available to be joined, and the state of each of those towns.

## Running this app locally

Running the application locally entails running both the backend service and a frontend.

### Setting up the backend

To run the backend, you will need a Twilio account. Twilio provides new accounts with $15 of credit, which is more than enough to get started.
To create an account and configure your local environment:

1. Go to [Twilio](https://www.twilio.com/) and create an account. You do not need to provide a credit card to create a trial account.
2. Create an API key and secret (select "API Keys" on the left under "Settings")
3. Create a `.env` file in the `services/townService` directory, setting the values as follows:

| Config Value            | Description                               |
| ----------------------- | ----------------------------------------- |
| `TWILIO_ACCOUNT_SID`    | Visible on your twilio account dashboard. |
| `TWILIO_API_KEY_SID`    | The SID of the new API key you created.   |
| `TWILIO_API_KEY_SECRET` | The secret for the API key you created.   |
| `TWILIO_API_AUTH_TOKEN` | Visible on your twilio account dashboard. |
| `DATABASE_URL`          | Connection string to PostgreSQL database. |

### Starting the backend

Once your backend is configured, you can start it by running `npm start` in the `services/townService` directory (the first time you run it, you will also need to run `npm install`).
The backend will automatically restart if you change any of the files in the `services/townService/src` directory.

### Configuring the frontend

Create a `.env` file in the `frontend` directory, with the line: `REACT_APP_TOWNS_SERVICE_URL=http://localhost:8081` (if you deploy the towns service to another location, put that location here instead)

### Configuring the Firebase
To be able to log in using either Email/Password, Google or Facebook as well as manage user account, you need to set up Firebase.
1. Create a Firebase account if you don't have.
2. Go to [Firebase console](https://console.firebase.google.com/u/0/), then `+ Add project` and follow the instructions to create a new project
3. Once it's done, you will be directed to Dashboard, go to the `Project settings` to create Firebase API for your app (It's the `Settings` next to `Project Overview` on the top left)
4. In your apps, choose `</>` then follow the instruction to install the Firebase into your apps (Note: you actually don't have to install anything at this step, just continuing clicking next until you're redirected back into `Project Settings`)
5. At that point, under `Your apps` in `Project Settings` you will see your Firebase API in `firebaseConfig` for Web App.
6. Add the following lines in the same `.env` file in front-end and replace `....` with the respective config value from the Firebase API config.
```
REACT_APP_APIKEY=....
REACT_APP_AUTHDOMAIN=....
REACT_APP_PROJECT_ID=....
REACT_APP_STORAGE_BUCKET=....
REACT_APP_MESSAGING_SENDER_ID=....
REACT_APP_APP_ID=....
REACT_APP_MEASUREMENT_ID=....
```
7. Next step, go to `Authentication` (it is under `Project Overview` on the left, select `Get started` if you haven't).
8. Go to `Sign-in method`, in the `Sign-in providers` tab, choose `Email/Password`, `Google` and `Facebook` for sign-in methods.
### Running the frontend

In the `frontend` directory, run `npm start` (again, you'll need to run `npm install` the very first time). After several moments (or minutes, depending on the speed of your machine), a browser will open with the frontend running locally.
The frontend will automatically re-compile and reload in your browser if you change any files in the `frontend/src` directory.
