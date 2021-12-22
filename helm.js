const {exec} = require("child_process");
const core = require('@actions/core');
const minimist = require('minimist')

const args = process.argv.slice(2)
const parsedArgs = minimist(args)
const charts = JSON.parse(parsedArgs.charts)
const repo = parsedArgs.repo

charts.forEach(chart => {
    const fullUrl = `${repo}/${chart.name}`
    core.info(`Installing chart ${fullUrl}:${chart.version}`)
    pullChart(fullUrl, chart.version).then(() => {
        // templateChart(fullUrl, chart.version, chart.values)
        installChart(chart.release_name, chart.namespace, fullUrl, chart.version, chart.values)
    })
})

function pullChart(chart, version) {
    const cmd = `helm pull ${chart} --version ${version}`
    return runCommand(cmd)
}

function installChart(release_name, namespace, chart, version, values) {
    let cmd = `helm install ${release_name} -n ${namespace} ${chart} --version ${version}`
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

function runCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error || stderr) {
                core.setFailed(error ? error : stderr)
                reject(error ? error : stderr)
            } else {
                core.info(stdout)
                resolve(stdout)
            }
        });
    })
}