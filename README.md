[![pipeline status](https://gitlab.pinigseu.xyz/jumpcut/jumpcut/badges/master/pipeline.svg)](https://gitlab.pinigseu.xyz/jumpcut/jumpcut/commits/master)
[![coverage Report](https://gitlab.pinigseu.xyz/jumpcut/jumpcut/badges/master/coverage.svg)](https://gitlab.pinigseu.xyz/jumpcut/jumpcut/commits/master)
[![JumpCut](https://img.shields.io/badge/JumpCut-ComingSoon-blue.svg)](https://gitlab.pinigseu.xyz/jumpcut/jumpcut/commits/master)

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

- Run `cp .env.template .env` and then set and save these. Make sure to run the command inside the `frontend` folder too. 

 Once that is complete you can build the project. For the production server, to test production, or if you are not using docker,
 there is an .env.template file in the backend folder that should be updated as well.
 
## Building the project

- Run `docker-compose build` to build the images
- Run `docker-compose run --rm api invoke setup-db` to create the db tables and load in some development data
- Run `docker-compose run --rm api python src/manage.py passwd admin` to set yourself a password for the admin user
- Run or you can run `docker-compose run --rm api python src/manage.py createsuperuser` for a new user account
- Run `docker-compose up` to start everything, and visit <localhost:8001> to log in

* I Highly recommend however, that you use the below script in wsl/linux

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

- Note: I strongly recommend you install wsl for windows which you can read instructions for docker and wsl setup on the next section.

Install Docker for Windows and set it up to use linux containers. You will have to [share
the drive](https://docs.docker.com/docker-for-windows/#shared-drives) where you have the git
repository.

From then on you can follow the instructions using your favourite command prompt.

Note that if you are using windows, due to the way the docker volume mounter handles file
permissions, you will have to type

    docker-compose run api python src/manage.py

instead of

    docker-compose run api src/manage.py

in the following instructions.

# wsl-docker-git-setup

I have added a shell script that can be run in the **Ubuntu for Windows Bash** running on the **Windows Subsystem for Linux (WSL)** to configure Bash for development using commandline **Docker** and **Git** commands in **Windows 10**.

## Prerequisits and Configuration

- Windows 10 Professional
- Windows Subsystem for Linux (WSL)
- Docker for Windows

### Installing the Windows Subsystem For Linux

Instructions for installing the Windows Subsystem for Linux on Windows 10 and Ubuntu for Windows can be found at the official WSL website:
 
https://msdn.microsoft.com/en-us/commandline/wsl/install_guide 

(The installation may require a system restart)

Once installation is complete, you should be able to start Ubuntu for Windows from the start menu. This project also includes an example shortcut for starting Ubuntu Bash.

### Installing and Configuring Docker for Windows

Instructions for installing Docker for Windows can be found at the official Docker website:

https://store.docker.com/editions/community/docker-ce-desktop-windows

(The installation may require a system restart to enable Hyper-V)

Once Docker for Windows has been installed, you will need to configure it so that it can be accessed from the WSL bash.

- Right click the Docker Whale icon in system tray
- Select "Settings..."
- Under the "General" section
  - Check the option to "Expose daemon on tcp://localhost:2375 without TLS"
- Under the "Shared Drives" section
  - Check the C Drive
- Apply Changes (You may be prompted for your login credentials)

## WSL Docker Git Setup Script

Git comes installed by default with Ubuntu for Windows. You can clone this repository immediately from your WSL Bash by running:

`git clone git@gitlab.pinigseu.xyz:jumpcut/jumpcut.git`

Make sure you have added your ssh key to git.

Once the code has been cloned you can run `wsl.sh` to configure your WSL Bash to be able to communicate with Docker for Windows and install a git-enabled commandline prompt that makes it easier to work with git from WSL.

`cd jumpcut`

`chmod +x ./scripts/wsl.sh`

`./scripts/wsl.sh`

The shell script:

- Adds a `DOCKER_HOST` environment variable in `.bashrc` to allow docker to connect to Docker for Windows
- Creates a mount from /mnt/c to /c so make sure that when you log back in after it is complete you will need to exit bash and start it again for some of the changes to be applied.
- Sets the default directory when WSL Bash starts

You should be able to run `docker` and `docker-compose` commands from the WSL Ubuntu commandline on Windows as well as see git branch information in the command prompt.

You can test them by running:
 
`docker info`

`docker-compose version`

`docker run hello-world`


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
This project uses yarn as its package/dependency manager. So after cloning the project, you will want to install the current version of [node](https://nodejs.org/). Depending on your OS, please see here on installing Yarn: [Yarn](https://yarnpkg.com/lang/en/docs/install/).  Once you have it installed you can run `yarn` in the project's root directory to install the project's dependencies.

## Building
We have npm scripts set up for dev loop builds and prod builds. Before you start, make sure and copy the env.template in the root of the frontend folder as .env. For the development build run the command: `yarn run dev`. Babel is needed for the webpack development build because the hmr requires it for some reason ([react-hot-loader](https://github.com/gaearon/react-hot-loader#typescript)).

* Note: Yarn is used in production and in docker, if you have any package changes you must commit any updates to your yarn.lock file.

### Development
By default, the code is setup for developing. The project adds several helpful debugging tools including a development server that supports module hot loading. If you run `yarn run start` it will do an initial development build and startup up the web server opening app in your browser (`http://localhost:3000`). You will then be able to make changes to the code and the server will run incremental builds and update the site (usually) without you having to refresh the page.

The following are links to various internal documentation pages that should be useful references while working on this project.
- [API documenataion](https://api.pinigseu.xyz/api/v1/schema/)
- [API Swagger Schema documentation](https://api.pinigseu.xyz/api/v1/swagger/)

### Production
In order to get the production ready files, all you need to do is run the default npm script command: `yarn run build`. This will remove any remnants of a previous build and then build the project without any of the development tools. It will then compress and uglify everything into a handful of files. All built files will be dumped in the '/dist' directory.

## Proxies
None of the APIs that this site is using are setup to work with localhost requests. Until they support CORS you will need to route all API traffic through a proxy. There is a proxy.js file in the root of the project for doing this.
- Run `node .\proxy.js "https://api.url.com"` to start the proxy server for the site api.
