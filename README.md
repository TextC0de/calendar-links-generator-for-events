# Calendar links generator for events

Create an event and get links to add it to your favorite calendar (Google, Outlook, Microsoft365, Yahoo) as well as an .ics file (for calendars like apple's).

## Installation

You will need `node` and `npm` installed globally on your machine.

```
git clone https://github.com/TextC0de/calendar-links-generator-for-events.git
cd calendar-links-generator-for-events
npm run install
```

**Start the app**

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
