alias _cd_deployment='cd /code/JumpCut/deployment'
alias start_containers='(_cd_deployment && docker-compose up -d)'
alias stop_containers='(_cd_deployment && docker-compose down)'
alias pull_containers='(_cd_deployment && docker-compose pull)'
alias deploy_updates='(_cd_deployment && bash deploy_updates.sh)'
alias logs='(_cd_deployment && docker-compose logs -f)'

function m() {
    (_cd_deployment && docker-compose run --rm www src/manage.py "$@")
}

alias shell='m shell_plus'
alias clean_slate='m reset_db --noinput && m migrate && m loaddata foundation'
alias fixtures='m loaddata dev'
