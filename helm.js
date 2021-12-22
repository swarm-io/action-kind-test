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
    // cmd = `helm install ${chart.release_name}`
    // if (chart.namespace) {
    //     cmd += ` -n ${chart.namespace}`
    // }
})

function pullChart(chart, version) {
    exec(`helm pull ${chart} --version ${version}`)
}

function templateChart(chart, version, values) {
    cmd = `helm template ${chart} --version ${version}`
    if (values) {
        cmd += ` -f ${values}`
    }
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}