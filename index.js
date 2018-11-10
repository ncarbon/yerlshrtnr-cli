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
        url:'http://yerlshrtnr.herokuapp.com/api/shorturl',
        form: {
            url: answers.url,
            customId: answers.customId,
            ttl: answers.ttl
        }
    }

    request.post(options, (err, response) => {
        response.body = JSON.parse(response.body);
        if(err) {
            console.log(err);
        } 
        else if(response.body.error) {
            handleError(response.body.error);
        } else {
            console.log();
            console.log(chalk.green('>>>> Shortened URL: ' ) + chalk.magenta(response.body.shortURL));
            console.log();
            if(answers.ttl) {
                console.log(chalk.bgRed(`Your short URL will expire in ${answers.ttl} seconds.`));
                console.log();
            }
        }
    });
};

var handleError = (err) => {
    if(err.type == 'DUPLICATE') {
        console.log('Error: Custom URL id already exists. Please try again.');
    } else {
        console.log(err)
        console.log('Error: Short URL could not be generated. Please try again.');
    }
};

run();



