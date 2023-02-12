function spdl() {
    if [ -f ./docker-compose.yml ]; then
        docker compose run --rm spdl "$@"
    else
        echo "spdl must be run next to docker-compose.yml!"
    fi
}
