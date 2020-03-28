#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const spinner = ora();
const fs = require('fs');
const path = require('path');
const errArr = [];
program.parse(process.argv);
const isDemo = program.args[0] === 'test';
if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log(chalk.red(`\n Please run patch4ie command at your project root path \n`));
    return;
}
spinner.start('Updating configuration...');
function readAngularJson() {
    try {
        const d = JSON.parse(fs.readFileSync('./angular.json', 'utf8'));
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
    } catch (e) {
        if (!errArr.includes('angular.json')) {
            errArr.push('angular.json');
        }
        console.error(e);
    }
}
function writeAngularJson(json) {
    try {
        fs.writeFileSync(!isDemo ? './angular.json' : './angular.demo.json', JSON.stringify(json));
    }catch (e) {
        if (!errArr.includes('angular.json')) {
            errArr.push('angular.json');
        }
        console.error(e);
    }
}

function readTsconfigJson() {
    try {
        const d = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf8'));
        d['compilerOptions']['target'] = 'es5';
        writeTsconfigJson(d);
    }catch (e) {
        if (!errArr.includes('tsconfig.json')) {
            errArr.push('tsconfig.json');
        }
        console.error(e);
    }
}
function writeTsconfigJson(json) {
    try {
        fs.writeFileSync(!isDemo ? './tsconfig.json' : './tsconfig.demo.json', JSON.stringify(json));
    }catch (e) {
        if (!errArr.includes('tsconfig.json')) {
            errArr.push('tsconfig.json');
        }
        console.error(e);
    }
}

function readPolyfillJs() {
    // this polyfills.js file may come from internet, so it not simply cp, should use write
    try {
        const d = fs.readFileSync(path.resolve(__dirname, '../polyfills.js'),'utf8');
        writePolyfillJs(d);
    }catch (e) {
        if (!errArr.includes('polyfills.ts')) {
            errArr.push('polyfills.ts');
        }
        console.error(e);
    }

}
function writePolyfillJs(jsContent) {
    try {
        fs.writeFileSync(!isDemo ? './src/polyfills.ts' : './src/polyfills.demo.ts', jsContent);
    }catch (e) {
        if (!errArr.includes('polyfills.ts')) {
            errArr.push('polyfills.ts');
        }
        console.error(e);
    }
}

function readBrowsersList() {
    try {
        const d = fs.readFileSync(path.resolve(__dirname, '../browserslist'),'utf8');
        writeBrowsersList(d);
    }catch (e) {
        if (!errArr.includes('browserslist')) {
            errArr.push('browserslist');
        }
        console.error(e);
    }

}
function writeBrowsersList(content) {
    try {
        fs.writeFileSync(!isDemo ? './browserslist' : './browserslistDemo', content);
    }catch (e) {
        if (!errArr.includes('browserslist')) {
            errArr.push('browserslist');
        }
        console.error(e);
    }

}
function startConfig() {
    readAngularJson();
    readTsconfigJson();
    readPolyfillJs();
    readBrowsersList();
    if (errArr.length > 0) {
        spinner.fail();
        for (let item of errArr) {
            console.log(chalk.red(`\n ${item} update failed \n`));
        }
    } else {
        spinner.succeed();
        console.log(chalk.green(`\n all configuration updated successfully! \n`));
    }

}
startConfig();
