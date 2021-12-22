const {exec} = require("child_process");
const core = require('@actions/core');
const minimist = require('minimist')

const args = process.argv.slice(2)
const parsedArgs = minimist(args)
const charts = JSON.parse(parsedArgs.charts)
const repo = parsedArgs.repo

charts.forEach(chart => {
    const fullUrl = `${repo}/${chart.name}`
    pullChart(fullUrl, chart.version)
    templateChart(fullUrl, chart.version, chart.values)
    runCommand("echo testing one && sleep 5 && echo testing one done")
    runCommand("echo testing two && sleep 5 && echo testing two done")
    // cmd = `helm install ${chart.release_name}`
    // if (chart.namespace) {
    //     cmd += ` -n ${chart.namespace}`
    // }
})

function pullChart(chart, version) {
    const cmd = `helm pull ${chart} --version ${version}`
    runCommand(cmd)
}

function templateChart(chart, version, values) {
    let cmd = `helm template ${chart} --version ${version}`
    if (values) {
        cmd += ` -f ${values}`
    }
    runCommand(cmd)
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