[![pipeline status](https://git.pinigseu.xyz/jumpcut/jumpcut/badges/master/pipeline.svg)](https://git.pinigseu.xyz/jumpcut/jumpcut/commits/master)
[![coverage Report](https://git.pinigseu.xyz/jumpcut/jumpcut/badges/master/coverage.svg)](https://git.pinigseu.xyz/jumpcut/jumpcut/commits/master)
[![JumpCut](https://img.shields.io/badge/JumpCut-ComingSoon-blue.svg)](https://git.pinigseu.xyz/jumpcut/jumpcut/commits/master)

![JumpCut](https://i.imgur.com/8UqIWFI.png)

A private BitTorrent tracker written with Python, Django, Redis, and React.

## To get started with the Backend / API

- Install docker and docker-compose
  ([Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/),
  [Mac](https://docs.docker.com/docker-for-mac/install/),
  [Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows),
  [compose](https://docs.docker.com/compose/install/))
  


### Environment Files:

* Before you get started make sure and set your environment variables. There is an .env.template file in the root of
the project. First copy the file as .env 

``cp .env.template .env`` and then set and save these. 

 Once that is complete you can build the project. For the production server, to test production, or if you are not using docker,
 there is an .env.template file in the backend folder that should be updated as well.
 
## Building the project

- Run `docker-compose build` to build the images
- Run `docker-compose run --rm api invoke setup-db` to create the db tables and load in some development data
- Run `docker-compose run --rm api python src/manage.py passwd admin` to set yourself a password for the admin user
- Run `docker-compose up` to start everything, and visit <localhost:8001> to log in

These commands will build all the containers and set up the database with our core fixtures.
This may take a while, but afterwards subsequent commands will be much faster.

## Managing

There are two ways of running common commands. The `jc.sh` script is responsible for things to do
with docker (running, building images) and `invoke` (sort of like Make, for python) is used within
the server to run commands. Django `manage.py` is also useful. Both invoke and manage.py are
accessible from the `jc.sh` script.

To list `jc.sh` commands:

    ./jc.sh

To list invoke commands:

    ./jc.sh i -l
    ./jc.sh i test

To list manage.py commands:

    ./jc.sh m
    ./jc.sh m passwd admin

### Running the dev server

    ./jc.sh runserver

You can find the api/django-admin server on <localhost:8000>, the frontend server on
<localhost:8001> and the tracker server on <localhost:7070>.

For example, here is an announce request that will work with the fixture data that was loaded in
by the `setup-db` command: <http://localhost:7070/16fd2706-8baf-433b-82eb-8c7fada847da/announce/?info_hash=%89I%85%F9%7C%C2%5C%24n7%A0%7C%D7%C7%85%999%82%A7%CB&peer_id=-UT3400-111122221111&uploaded=721&downloaded=982&left=0&port=1337&ip=192.168.1.4>

### Rebuilding containers

If you change

a) The python requirements file in backend

b) Any frontend files not in frontend/src/ including the javascript requirements file

you need to rebuild your local containers
by running:

    ./jc.sh build

There is no need to do this if you just change the source code for either the frontend or backend
(they are on docker volumes and changes should be loaded immediately)


## Windows

Install Docker for Windows and set it up to use linux containers. You will probably have to [share
the drive](https://docs.docker.com/docker-for-windows/#shared-drives) where you have the git
repository.

From then on you can follow the instructions using your favourite command prompt.

Note that if you are using windows, due to the way the docker volume mounter handles file
permissions, you will have to type

    docker-compose run api python src/manage.py

instead of

    docker-compose run api src/manage.py

in the following instructions.

## Windows Instructions with No Docker

To start you need to install the following:

 - Python 3.6.5: <https://www.python.org/ftp/python/3.6.5/python-3.6.5-amd64.exe>

    make sure you edit your environment variables so you can call python, and pip.

I recommend using Windows PowerShell for most commands.

 - Install Chocolatey for quick postgres install <https://chocolatey.org/>

 Install Postgresql: `choco install postgresql`

 Install Redis for windows: <https://github.com/MicrosoftArchive/redis/releases>

 You should then have postgresql installed. Make sure you set the postgresql database to the new .env file you have.
 Password, DB, etc.

 - Virtual Env  `pip3 install virtualenvwrapper-win`

 Now you can create a new virtual environment with the mkvirtualenv command. As this command runs you'll see the environment being set up (what you see is slightly platform specific). When the command completes the new virtual enviroment will be active — you can see this because the start of the prompt will be the name of the environment in brackets (as shown below).

    `mkvirtualenv my_django_environment`
    `From now on in this README (and indeed the module) please assume that any commands are run within a Python virtual environment like the one we set up above.`

 - Install Requirements:

  Now use the install script, I have added a new file at the backend folder of the project, make sure your virtual environment is activated first!!!.

    `cd backend`
    `python -m pip install -r requirements.txt (now pip automatically will not install UWSGI)`
    `python -m pip install -r testing_requirements.txt`

 - Run the Development Server

  cd into the src folder and run the following before running the server:

  * Make Migrations:

  `python manage.py makemigrations`

  * Migrate:

  `python manage.py migrate`

  * Fixtures:

  `python manage.py loaddata foundation`

  `python manage.py loaddata dev`

  * Collect static files

  `python manage.py collectstatic --noinput`

  * Server:

  `python manage.py runserver_plus 0.0.0.0:8000`

 - I have updated the index.html file for it to work locally for everyone. Before you run "Collectstatic",
    make sure and copy the index.html, and bundle files from the folder here:

    `/backend/src/gulpfiles`

  Copy them to the folder labelled: `static/frontend`.

You can overwrite these files in the directory locally.


## Useful Commands

- `./jc.sh i reset-db`

This command resets the db and loads the core fixtures to revert to a starting state.

Currently the admin user password it creates is hashed and salted using argon2. It is recommended
that you use the function:

- `./jc.sh m passwd admin`

To enter a new password for testing.

# The Frontend

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
- [API documenataion](https://api.pinigseu.xyz/api/v1/schema/)
- [API Swagger Schema documentation](https://api.pinigseu.xyz/api/v1/swagger/)

### Production
In order to get the production ready files, all you need to do is run the default gulp command: `gulp`. This will remove any remnants of a previous build and then build the project without any of the development tools. It will then compress and uglify everything into a handful of files. All built files will be dumped in the '/dist' directory. If you want to see the result of the build, you can start a simple webserver by running `gulp connect` and navigating to `http://localhost:4000`. You will want to make sure you do not already have a development server running because they will fight for resources.

## Proxies
None of the APIs that this site is using are setup to work with localhost requests. Until they support CORS you will need to route all API traffic through a proxy. There is a proxy.js file in the root of the project for doing this.
- Run `node .\proxy.js "https://api.url.com"` to start the proxy server for the site api.
