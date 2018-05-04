import invoke

MANAGE_PATH = 'src/manage.py'
WWW_SETTINGS = 'jumpcut.settings.www_settings'
TRACKER_SETTINGS = 'jumpcut.settings.tracker_settings'
TESTING_SETTINGS = 'jumpcut.settings.testing_settings'


def _manage_run(ctx, command, settings=None):
    torun = f'python {MANAGE_PATH} {command}'
    if settings is not None:
        torun += ' --settings=' + settings
    ctx.run(torun)


@invoke.task
def delete_migrations(ctx):
    ctx.run('rm -f src/*/migrations/[0-9]*.py')


@invoke.task
def make_migrations(ctx):
    _manage_run(ctx, 'makemigrations users')
    _manage_run(ctx, 'makemigrations')


@invoke.task
def migrate(ctx):
    _manage_run(ctx, 'migrate')


@invoke.task
def clean_slate(ctx):
    _manage_run(ctx, 'reset_db --noinput')
    delete_migrations(ctx)
    make_migrations(ctx)
    _manage_run(ctx, 'migrate')
    _manage_run(ctx, 'loaddata foundation')


@invoke.task
def fixtures(ctx):
    _manage_run(ctx, 'loaddata dev')


@invoke.task
def foundation(ctx):
    _manage_run(ctx, 'loaddata foundation')


@invoke.task
def shell(ctx):
    _manage_run(ctx, 'shell_plus')


@invoke.task
def run_python_linter(ctx):
    ctx.run('flake8')


@invoke.task
def run_python_tests(ctx, coverage=False):
    if coverage:
        ctx.run(
            'coverage run --source=''.'' {} test torrents tracker interfaces --settings=jumpcut.settings.testing_settings -v 3'.format(
                MANAGE_PATH))
        ctx.run('coverage report -m')
    else:
        ctx.run('{} test src'.format(MANAGE_PATH))


@invoke.task
def ci(ctx, coverage=False):
    """
    Run all the tests as they are done on circleci
    """
    run_python_linter(ctx)
    run_python_tests(ctx, coverage)
