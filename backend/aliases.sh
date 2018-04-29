# To replicate the old aliases:
# Source this at startup to run

alias m="docker-compose run --rm api python src/manage.py"
alias i="docker-compose run --rm api invoke"
alias runserver="docker-compose up"
alias clean_slate="i clean-slate"
alias fixtures="i fixtures"
alias shell="m shell_plus"
alias delete_migrations="i delete-migrations"
alias make_migrations="i make-migrations"
