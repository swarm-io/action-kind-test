const { exec } = require("child_process");
const minimist = require('minimist')

const args = process.argv.slice(2)
const parsedArgs = minimist(args)
const charts = JSON.parse(parsedArgs.charts)
const repo = parsedArgs.repo

charts.forEach(chart => {
    cmd = `helm install ${chart.release_name}`
    if (chart.namespace) {
        cmd += `-n ${chart.namespace}`
    }
    cmd += `${repo}/${chart.name} --version ${chart.version}`
    if (chart.values) {
        cmd += `-f ${chart.values}`
    }
    console.log(`cmd is ${cmd}`)
})
// exec("ls -la", (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });