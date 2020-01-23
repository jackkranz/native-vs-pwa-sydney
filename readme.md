## PWA Demo

Uses Express + Node to create a basic webserver for app demo

Each subfolder (```pwa_#```) is the application and server code from a different part of the presentation:

- 0 = the web app with no PWA features
- 1 = Manifest.json added & Serviceworker added + installed
- 2 = Cache 1st caching strategy + Cache Whitelisting 
- 3 = Network 1st
- 4 = Post Caching + Message API
- Final = post caching + network first + store offline data in localstorage.

The f5 experience:

1.  ``` npm i``` in each subfolder.

1.  ``` npm start``` from the desired subfolder to start the server on localhost
