#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const download = require('download-git-repo');
const tpl = require(`${__dirname}/../template`);
const spinner = ora('Downloading...');
const fs = require('fs');
const path = require('path');
// spinner.start();
function readAngularJson() {
    fs.readFile('angular.json','utf8', (err, data) => {
        const d = JSON.parse(data);
        for(const k of Object.keys(d['projects'])) {
            // add es5BrowserSupport: true
            d['projects'][k]['architect']['build']['options'].es5BrowserSupport = true;
            if (d['projects'][k]['architect']['build']['configurations']) {
                // add es5 config for build
                d['projects'][k]['architect']['build']['configurations']['es5'] = {
                    "tsConfig": "./tsconfig-es5.app.json"
                };
            }
            // add es5 config for serve
            if (d['projects'][k]['serve']) {
                d['projects'][k]['serve']['es5'] = {
                    "browserTarget": "app:build:es5"
                };
            }
        }
        writeAngularJson(d);
    });
}
function writeAngularJson(json) {
    fs.writeFile('angular.json', JSON.stringify(json), (err, data) => {
        if (err) {
            console.error(err);
        }
        console.log('修改 angular.json 成功===')
    });
}

function readTsconfigJson() {
    fs.readFile('tsconfig.json', 'utf8', (err, data) => {
        const d = JSON.parse(data);
        d['compilerOptions']['target'] = 'es5';
        writeTsconfigJson(d);
    });
}
function writeTsconfigJson(json) {
    fs.writeFile('tsconfig.json', JSON.stringify(json), (err, data) => {
        if (err) {
            console.error(err);
        }
        console.log('修改 tsconfig.json 成功===')
    });
}

function readPolyfillJs() {
    // this polyfills.js file may come from internet, so it not simply cp, should use write
    fs.readFile('polyfills.js','utf8', (err, data) => {
        writePolyfillJs(data);
    });
}
function writePolyfillJs(jsContent) {
    fs.writeFile(path.resolve(__dirname, './src/polyfills.ts'), jsContent, (err, data) => {
        if (err) {
            console.error(err);
        }
        console.log('修改 polyfills.ts 成功===')
    });
}

function readBrowsersList() {
    fs.readFile(path.resolve(__dirname, '../browserslist'),'utf8', (err, data) => {
        console.log(data)
    });
}
readBrowsersList();
// download(tpl['polyfill'], 'dist', null, (err) => {
//     if (err) {
//         spinner.fail();
//         console.log(chalk.red(`Download failed ${err}`));
//         return;
//     }
//     spinner.succeed();
//
// });
