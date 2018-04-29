alias _cd_deployment='cd /code/jumpcut/deployment'
alias start_containers='(_cd_deployment && docker-compose up -d)'
alias stop_containers='(_cd_deployment && docker-compose down)'
alias pull_containers='(_cd_deployment && docker-compose pull)'
alias deploy_updates='(_cd_deployment && bash deploy_updates.sh)'
alias logs='(_cd_deployment && docker-compose logs -f)'

function m() {
    (_cd_deployment && docker-compose run --rm www src/manage.py "$@")
}

function delete_migrations() {
    (_cd_deployment && docker-compose run --rm www rm -f src/*/migrations/[0-9]*.py )
}

alias shell='m shell_plus'
alias clean_slate='delete_migrations && m reset_db --noinput && m migrate && m loaddata foundation'
alias fixtures='m loaddata dev'
