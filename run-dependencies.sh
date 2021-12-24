#!/bin/bash
set -e

dependencies=$1

mkdir dependencies && cd dependencies

for i in ${dependencies//,/ }
do
#  gh repo clone ${GITHUB_REPOSITORY_OWNER}/$i
  git clone https://github.com/${GITHUB_REPOSITORY_OWNER}/$i.git
  cd $i
  pwd
  ls
#  skaffold run --port-forward=user --verbosity=info > ${GITHUB_WORKSPACE}/skaffold-logs/$i.txt &
  skaffold run --verbosity=info
done