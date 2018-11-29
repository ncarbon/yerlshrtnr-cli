#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const request = require('request');

var validateUrl = (url) => {
    var pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/;
    return pattern.test(url);
};

var displayPrompt = () => {
    return inquirer.prompt([
        {
            name: 'url',
            type: 'input',
            message: chalk.cyan('Enter the URL to be shortened'),
            validate: function (input) {
                var done = this.async();
                var pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/;
                if(!pattern.test(input)) {
                    done('Invalid input. Please try again.');
                    return;
                }
                done(null, true);
            }
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
            message: chalk.cyan('What is your custom URL ID? e.g yrlshrt.com/[YOUR_CUSTOM_ID]')
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

    // TODO: handle url expiration settings if any

    const options = {
        url:'http://www.yrlshrt.com/api/shorturl',
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
        } else if(response.body.error) {
            handleError(response.body.error);
        } else {
            console.log();
            if(response.body.duplicate) {
                console.log(chalk.yellow('The custom id provided already exists. A random one was generated below.'));
            }
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
    console.log(err);
    console.log('Error: Short URL could not be generated. Please try again.');
};

run();



