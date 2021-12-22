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
            installChart(chart.release_name, chart.namespace, fullUrl, chart.version, chart.values, timeout).then(() => {
                createPullSecret(chart.namespace)
            })
        })
    })
})

function pullChart(chart, version) {
    const cmd = `helm pull ${chart} --version ${version}`
    return runCommand(cmd)
}

function installChart(release_name, namespace, chart, version, values, timeout) {
    let cmd = `helm install ${release_name} -n ${namespace} ${chart} --version ${version} --create-namespace --wait --timeout ${timeout}`
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