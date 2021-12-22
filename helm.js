const { exec } = require("child_process");
const minimist = require('minimist')

const args = process.argv.slice(2)

const parsedArgs = minimist(args)

console.log('Parsed Arguments:', parsedArgs)

const charts = parsedArgs.charts
console.log(`charts: ${charts}`)
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