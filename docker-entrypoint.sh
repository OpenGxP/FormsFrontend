#!/usr/bin/env bash
set -e

# get backend endpoint url
[[ ! -z "${VUE_APP_BACKEND}" ]] || (echo "VUE_APP_BACKEND must not be empty."; exit 1)

target=/data/app/runtimeEndpoint.json

json='{"endpoint":"'${VUE_APP_BACKEND}'"}'

if [ -f "$target" ]
then
    echo "$json" > "$target"
fi

nginx -g "daemon off;"
