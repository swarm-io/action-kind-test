const {exec} = require("child_process");
const core = require('@actions/core');
const minimist = require('minimist')
const yaml = require('js-yaml');
const fs   = require('fs');
const chartDownloadDir = 'chart-download'
const args = process.argv.slice(2)
const parsedArgs = minimist(args)
const charts = JSON.parse(parsedArgs.charts)
const repo = parsedArgs.repo
const timeout = parsedArgs.timeout
const path = require('path');

charts.forEach(chart => {
    const chartUrl = `${repo}/${chart.name}`
    fillDefaults(chart)
    core.info(`Installing chart ${chartUrl}:${chart.version}`)
    doInstall(chartUrl, chart)
})

function fillDefaults(chart) {
    chart.version = chart.version ? chart.version : 'stable'
    chart.release_name = chart.release_name ? chart.release_name : chart.name
    chart.namespace = chart.namespace ? chart.namespace : chart.name
}

function doInstall(chartUrl, chart) {
    loadImageToKind(chartUrl, chart).then(() => {
        return installChart(chartUrl, chart, timeout)
    })
}

function pullChart(chartUrl, chart) {
    const cmd = `helm pull ${chartUrl} --version ${chart.version} --untar --untardir ${chartDownloadDir}`
    return runCommand(cmd)
}

function loadImageToKind(chartUrl, chart) {
    // pull chart
    return pullChart(chartUrl, chart).then(() => {
        const image = getChartImage()
        pullImage(image).then(() => {
            loadImage(image).then(() => {
                core.info(`loaded image ${image} to kind cluster`)
            })
        })
    })
}

function loadImage(image) {
    const cmd = `kind load docker-image ${image}`
    return runCommand(cmd)
}

function pullImage(image) {
    core.info(`pulling docker image ${image}`)
    const cmd = `docker pull ${image}`
    return runCommand(cmd)
}

function installChart(chartUrl, chart, timeout) {
    let cmd = `helm install ${chart.release_name} -n ${chart.namespace} ${chartUrl} --version ${chart.version} --create-namespace --wait --timeout ${timeout}`
    if (chart.values) {
        cmd += ` -f ${chart.values}`
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

function getChartImage() {
    const downloadedChartPath = getDownloadedChartPath()
    const chartYaml = getChartYaml(downloadedChartPath)
    const values = getValuesYaml(downloadedChartPath)
    return `${values.image.repository}:${chartYaml.appVersion}`
}

function getChartYaml(path) {
    return yaml.load(fs.readFileSync(`${path}/Chart.yaml`, 'utf8'))
}

function getValuesYaml(path) {
    return yaml.load(fs.readFileSync(`${path}/values.yaml`, 'utf8'))
}

function getDownloadedChartPath() {
    const files = fs.readdirSync(chartDownloadDir)
    return path.resolve(chartDownloadDir, files[0])
}

function removeChartDownloadDirectory() {
    fs.rm(chartDownloadDir, { recursive: true, force: true }, (err) => {
        if (err) {
            core.setFailed(err)
        }
    });
}