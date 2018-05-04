[![pipeline status](https://git.ronzertnert.me/jumpcut/jumpcut/badges/master/pipeline.svg?private_token=ce7CRXw_YsYzvC_ZwNfQ)](https://git.ronzertnert.me/jumpcut/jumpcut/commits/master)
[![coverage Report](https://git.ronzertnert.me/jumpcut/jumpcut/badges/master/coverage.svg?private_token=ce7CRXw_YsYzvC_ZwNfQ)](https://git.ronzertnert.me/jumpcut/jumpcut/commits/master)
[![JumpCut](https://img.shields.io/badge/JumpCut-ComingSoon-blue.svg)](https://git.ronzertnert.me/jumpcut/jumpcut/commits/master)

![JumpCut](https://i.imgur.com/8UqIWFI.png)

A private BitTorrent tracker backend written in python, django, and redis

## To get started

- Install docker and docker-compose
  ([ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/),
  [mac](https://docs.docker.com/docker-for-mac/install/),
  [compose](https://docs.docker.com/compose/install/))
- Run `docker-compose run api invoke clean-slate` to load up the default db data
- Run `docker-compose run api python src/manage.py passwd admin` to set yourself a password for the admin
  user
- Run `docker-compose run api invoke fixtures` to load up the development fixtures (see below)

The `docker-compose` builds all the containers and sets up the database with our core fixtures.
This may take a while, but afterwards subsequant commands will be much faster

It is highly recommended that you add the following lines or simillar to your `~/.bashrc`:

    alias jc_i="docker-compose run api invoke"
    alias jc_m="docker-compose run api src/manage.py"
    alias jc_f="docker-compose run frontend"
    
## New Make File:

Now there is a make file you can use at the root of the project:

View it to see the necessary commands.

 ## TODO: make windows.bat file.
 

### Windows

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
 
  Now install the requirements, I have added a new folder at the root of the project.
    
    `cd backend`
    `pip3 install -r windows_requirements.txt`
    
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
    
    </backend/src/gulpfiles>
    
  Copy them to the folder in the src directory to the folder labelled: static/frontend.
  You can overwrite these files in the directory currently.
  
 

## Starting a dev server

To start all the services and the development servers for the frontend and backend run:

    docker-compose up

This will bring up everything

You can find the api/django-admin server on <localhost:8000>, the frontend server on
<localhost:8001> and the tracker server on <localhost:7070>.

## Rebuilding containers

If you change 

a) The python requirements file in backend

b) Any frontend files not in frontend/src/ (this is because the place node_modules is installed
means we cannot mount the whole frontend directory as a volume)

you need to rebuild your local containers
by running:

    docker-compose build

There is no need to do this if you just change the source code for either the frontend or backend
(they are on docker volumes and changes should be loaded immediately)

## Useful Commands

- `jc_i clean-slate` or `docker-compose run web invoke clean-slate` without alias

This command resets the db and loads the core fixtures to revert to a starting state.

Currently the admin user password it creates is hashed and salted using argon2. It is recommended 
that you use the function:

- `jc_m change-password admin` or `docker-compose run web backend/manage.py changepassword ` without
  alias

To run the dev server, tracker and frontend and the services needed for it.

`docker-compose up`

The main backend site/api is accessible on `localhost:8000`.

To enter a new password for testing. 

You may also add in fixtures to add in dummy forums, and 2 more users.

you can do this by entering:

- `jc_m loaddata dev` or `docker-compose run web backend/manage.py loaddata dev` (you should see
  now why the aliases are useful).

The users are api, and user1.

## Out of date - todo change

You will also need to start `celery` to coordinate background tasks (such as the handling of
announces):

- `start_celery`

All of the `start_<thing>` aliases have `stop_<thing>` counterparts.  Once you have everything
started up, you can visit <http://localhost:8000> in your browser to see the site, and you can
make requests to the tracker at <http://localhost:7070>.

For example, here is an announce request that will work with the fixture data that was loaded in
by the `clean_slate` command: <http://localhost:7070/16fd2706-8baf-433b-82eb-8c7fada847da/announce?info_hash=%89I%85%F9%7C%C2%5C%24n7%A0%7C%D7%C7%85%999%82%A7%CB&peer_id=-UT3400-111122221111&uploaded=721&downloaded=982&left=0&port=1337&ip=192.168.1.4>
