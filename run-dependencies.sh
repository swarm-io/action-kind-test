#!/bin/bash

dependencies=$1

mkdir dependencies && cd dependencies

for i in ${dependencies//,/ }
do
  gh repo clone ${GITHUB_REPOSITORY_OWNER}/$i
  cd $i
  skaffold run --port-forward=user --verbosity=info > ${GITHUB_WORKSPACE}/skaffold-logs/$i.txt &
done