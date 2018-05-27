# Introduction
The web front-end code for JumpCut code named Phoenix for development purposes.

The site is built with [webpack](https://webpack.github.io/). We are using [Typescript](https://www.typescriptlang.org/) to make collaboration and maintenance easier. The UI is built on top of the [React](https://facebook.github.io/react/) framework using [Redux](http://redux.js.org/) as our state container.

# Getting Started
This project uses npm as its package/dependency manager. So after cloning the project, you will want to install the current version of [node](https://nodejs.org/) (which includes npm). Once you have it installed you can run `npm install` in the project's root directory to install the project's dependencies.

## Building
We are using [gulp](http://gulpjs.com/) as our task toolkit and since it is one of our npm dependencies, it should already be available. We really only need it for the 'cdn' task right now. We also have npm scripts set up for dev loop builds and prod builds.
Babel is needed for the webpack development build because the hmr requires it for some reason ([react-hot-loader](https://github.com/gaearon/react-hot-loader#typescript)).

### Development
By default, the code is setup for developing. The project adds several helpful debugging tools including a development server that supports module hot loading. If you run `npm run start` it will do an initial development build and startup up the web server opening app in your browser (`http://localhost:3000`). You will then be able to make changes to the code and the server will run incremental builds and update the site (usually) without you having to refresh the page.

The following are links to various internal documentation pages that should be useful references while working on this project.
- [API documenataion](https://www.pinigseu.xyz/docs)
- [API Swagger Schema documentation](https://www.pinigseu.xyz/v1/swagger/)
- [API Redoc Schema documentation](https://www.pinigseu.xyz/redoc)
- [Server side model documentation](https://www.pinigseu.xyz/model-docs)

### Production
In order to get the production ready files, all you need to do is run the default gulp command: `gulp`. This will remove any remnants of a previous build and then build the project without any of the development tools. It will then compress and uglify everything into a handful of files. All built files will be dumped in the '/dist' directory. If you want to see the result of the build, you can start a simple webserver by running `gulp connect` and navigating to `http://localhost:4000`. You will want to make sure you do not already have a development server running because they will fight for resources.

## Proxies
None of the APIs that this site is using are setup to work with localhost requests. Until they support CORS you will need to route all API traffic through a proxy. There is a proxy.js file in the root of the project for doing this.
- Run `node .\proxy.js "https://api.url.com"` to start the proxy server for the site api.