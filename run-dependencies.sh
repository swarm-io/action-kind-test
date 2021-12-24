#!/bin/bash
set -e

dependencies=$1

mkdir dependencies && cd dependencies

for i in ${dependencies//,/ }
do
  git clone https://${GITHUB_TOKEN}@github.com/swarm-io/event-stream-coordinator.git
  cd $i
  pwd
  ls
#  skaffold run --port-forward=user --verbosity=info > ${GITHUB_WORKSPACE}/skaffold-logs/$i.txt &
  skaffold run --verbosity=info
done