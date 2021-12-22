const { exec } = require("child_process");
const minimist = require('minimist')

const args = process.argv.slice(2)
const parsedArgs = minimist(args)
const charts = parsedArgs.charts
console.log(`charts type is: ${typeof charts}`);
console.log(`charts is ${charts}`)
charts.forEach(chart => {
    console.log('chart')
    console.log(`chart name: ${chart.name}`)
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