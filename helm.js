const { exec } = require("child_process");
const minimist = require('minimist')

const args = process.argv.slice(2)
const parsedArgs = minimist(args)
const charts = JSON.parse(parsedArgs.charts)
const repo = JSON.parse(parsedArgs.repo)

charts.forEach(chart => {
    cmd = `helm template ${repo}/${chart.name} --version ${chart.version}`
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