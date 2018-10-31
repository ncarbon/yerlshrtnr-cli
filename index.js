#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const request = require('request');

var displayPrompt = () => {
    return inquirer.prompt([
        {
            name: 'url',
            type: 'input',
            message: chalk.cyan('Enter the URL to be shortened')
        },
        {
            name: 'wantCustomId',
            type: 'confirm',
            default: true,
            message: chalk.cyan('Do you want a custom URL id?')
        },
        {
            when: (response) => {
                return response.wantCustomId;
            },
            name: 'customId',
            type: 'input',
            message: chalk.cyan('What is your custom URL ID? e.g yerlshrtnr.com/[YOUR_CUSTOM_ID]')
        },
        {
            name: 'wantTtl',
            type: 'confirm',
            default: true,
            message: chalk.cyan('Do you want to set an expiration time for short URL?')
        },
        {
            when: (response) => {
                return response.wantTtl;
            },
            name: 'ttl',
            type: 'input',
            message: chalk.cyan('When do you want the short URL to expire? (seconds)')
        }
    ]);
}


const init = () => {
    console.log(
        chalk.cyan(
            figlet.textSync('yerlshrtnr', {
                font: 'big',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );
};

const run = async () => {
    init();
    const answers = await displayPrompt();

    const options = {
        url:'https://yerlshrtnr.herokuapp.com/api/short_url',
        form: {
            url: answers.url,
            customId: answers.customId,
            ttl: answers.ttl
        }
    }

    request.post(options, (err, response) => {
        if(err) {
            console.log(err);
        } else {
            const json = JSON.parse(response.body);
            console.log();
            console.log(chalk.green('>>>> Shortened URL: ' ) + chalk.magenta(json.shortURL));
            console.log();
            if(answers.ttl) {
                console.log(chalk.bgRed(`Your short URL will expire in ${answers.ttl} seconds.`));
                console.log();
            }
        }
    });
};

run();



