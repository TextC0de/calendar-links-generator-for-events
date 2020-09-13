# Calendar links generator for events

Create an event and get links to add it to your favorite calendar (Google, Outlook, Microsoft365, Yahoo) as well as an .ics file (for calendars like apple's).

## Installation

You will need `node` and `npm` installed globally on your machine.

```
git clone https://github.com/TextC0de/calendar-links-generator-for-events.git
cd calendar-links-generator-for-events
npm install
npm run install
```

Note that you must first run `npm install` to install the [concurrently package](https://www.npmjs.com/package/concurrently) which will allow you to run `npm run install`. This last command will install the client and server dependencies.

**Start the development app**

```bash
npm run dev
```

This will start webpack-dev-server on [0.0.0.0:3000](http://0.0.0.0:3000/) and an express server on [localhost:5000](http://localhost:5000/)

**Build the app**

```bash
npm run build
```

this will build the app for production. The client build will be inside the client/build folder and the server build will be inside server/build folder.
The express server saves the generated .ics files in the public folder, so that folder must exist for express to be able to save the files.

**Start the production app**

```bash
npm run build
npm start
```

After build the application, you can start the application for production. Note that you must create a .env.production file in the root folder which must specify the SERVER_HOST and EXPRESS_PORT variables.
