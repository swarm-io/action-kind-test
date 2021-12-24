#!/bin/bash
set -e

dependencies=$1

mkdir dependencies && cd dependencies

for i in ${dependencies//,/ }
do
  git clone https://${GITHUB_TOKEN}@github.com/swarm-io/${i}.git
  cd $i
  echo "will log to ${GITHUB_WORKSPACE}/skaffold-logs/${i}.txt"
  echo "stuff" > ${GITHUB_WORKSPACE}/skaffold-logs/${i}.txt
  cat ${GITHUB_WORKSPACE}/skaffold-logs/${i}.txt
  echo "stuff" > ${GITHUB_WORKSPACE}/skaffold-logs/${i}.txt
  skaffold run --port-forward=user --verbosity=info > ${GITHUB_WORKSPACE}/skaffold-logs/${i}.txt &
done