
import pip

_all_ = [
    # requirements.txt
    'Django[argon2]==2.0.5',
    'Markdown==2.6.11',
    'Pillow==5.1.0',
    'Pygments==2.2.0',
    'Werkzeug==0.14.1',
    'anyjson==0.3.3',
    'amqp==2.2.2',
    'beautifulsoup4==4.6.0',
    'billiard==3.5.0.3',
    'celery==4.1.0',
    'cffi==1.11.5',
    'dj-database-url==0.5.0',
    'django-debug-toolbar==1.9.1',
    'django-extensions==2.0.7',
    'django-picklefield==1.0.0',
    'django-ratelimit==1.1.0',
    'django-redis==4.9.0',
    'django-su==0.6.0',
    'djangorestframework==3.8.2',
    'kombu==4.1.0',

    'pycparser==2.18',
    'pytz==2018.4',
    'redis==2.10.6',
    'requests==2.18.4',
    'six==1.11.0',
    'sqlparse==0.2.4',
    'tqdm==4.23.3',
    'django-cors-headers==2.2.0',
    'django-filter==2.0.0.dev1',
    'coreschema==0.0.4',
    'coreapi==2.3.3',
    'Sphinx==1.7.4',
    # django-docs
    'https://github.com/littlepea/django-docs/archive/master.zip',  # updated version
    'sphinx_rtd_theme==0.3.0',
    'djangorestframework-camel-case==1.0b1',
    'https://github.com/philipn/django-rest-framework-filters/archive/master.zip',
    # djangorestframework-filters
    'https://github.com/darklow/django-suit/tarball/v2',
    'djangorestframework-jwt>=1.11.0',
    'drf-yasg[validation]==1.7.4',
    'python-decouple==3.1',
    'django-positions==0.6.0',
    # Testing Requirements
    'flake8==3.5.0',
    'ipdb==0.11',
    'ipython==6.4.0',
    'decorator==4.2.1',
    'django-dynamic-fixture==2.0',
    'django-email-bandit==1.5',
    'mccabe==0.6.1',
    'mysqlclient==1.3.12',
    'pep8==1.7.1',
    'phpserialize==1.3',
    'pycodestyle==2.3.1',
    'pyflakes==1.6.0',
    'invoke==0.23.0',
    'coverage==4.5.1',
    'factory-boy',
    'model_mommy==1.5.1',
    'isort==4.3.4',
]

# windows requirements?
windows = ['mod_wsgi==4.6.4', 'psycopg2-binary', ]

# only install UWSGI on linux
linux = ['uWSGI==2.0.17', 'psycopg2>=2.7', ]


def install(packages):
    for package in packages:
        pip.main(['install', package])


if __name__ == '__main__':

    from sys import platform

    install(_all_)
    if platform == 'windows':
        install(windows)
    if platform.startswith('linux'):
        install(linux)
    if platform == 'darwin':  # MacOS
        install(linux)
