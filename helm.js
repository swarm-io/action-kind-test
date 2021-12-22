const {exec} = require("child_process");
const core = require('@actions/core');
const minimist = require('minimist')

const args = process.argv.slice(2)
const parsedArgs = minimist(args)
const charts = JSON.parse(parsedArgs.charts)
const registry = parsedArgs.registry
const repo = parsedArgs.repo
const timeout = parsedArgs.timeout

charts.forEach(chart => {
    const fullUrl = `${repo}/${chart.name}`
    core.info(`Installing chart ${fullUrl}:${chart.version}`)
    pullChart(fullUrl, chart.version).then(() => {
        core.info(`Template for chart ${fullUrl}:${chart.version}`)
        templateChart(fullUrl, chart.version, chart.values).then(() => {
            doInstall(chart.release_name, chart.namespace, fullUrl, chart.version, chart.values, timeout)
        })
    })
})

function pullChart(chart, version) {
    const cmd = `helm pull ${chart} --version ${version}`
    return runCommand(cmd)
}

function createNamespace(namespace) {
    const cmd = `kubectl create namespace ${namespace}`
    return runCommand(cmd)
}

function doInstall(release_name, namespace, chart, version, values, timeout) {
    // create namespace
    return createNamespace(namespace).then(() => {
        // create pull secret
        createPullSecret(namespace).then(() => {
            // install chart
            return installChart(release_name, namespace, chart, version, values, timeout)
        })
    })
}

function installChart(release_name, namespace, chart, version, values, timeout) {
    let cmd = `helm install ${release_name} -n ${namespace} ${chart} --version ${version} --wait --timeout ${timeout}`
    if (values) {
        cmd += ` -f ${values}`
    }
    return runCommand(cmd)
}

function templateChart(chart, version, values) {
    let cmd = `helm template ${chart} --version ${version}`
    if (values) {
        cmd += ` -f ${values}`
    }
    return runCommand(cmd)
}

function createPullSecret(namespace) {
    // cmd = `kubectl -n ${namespace} create secret docker-registry regcred --docker-server=${registry} --docker-username=${username} --docker-password=${password}`
    const cmd = `kubectl -n ${namespace} create secret generic regcred --from-file=.dockerconfigjson=/home/runner/.docker/config.json --type=kubernetes.io/dockerconfigjson`
    return runCommand(cmd)
}

function runCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                core.setFailed(error)
                reject(error)
            } else {
                const result = stdout ? stdout : stderr
                core.info(result)
                resolve(result)
            }
        });
    })
}