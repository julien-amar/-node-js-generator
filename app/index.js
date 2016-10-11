const generators = require('yeoman-generator');
const yosay = require('yosay')
const chalk = require('chalk')
const _ = require('lodash')

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
    },

    initializing: function() {
        var lastIndex = this.destinationPath().lastIndexOf('\\')

        this.CURRENT_DIR_NAME = this.destinationPath().substring(lastIndex + 1)
    },

    prompting: function() {
        this.log(yosay('Welcome to ' + chalk.blue('Tool WebAPI project template') + ' generator'))

        var tryToReloadPromptFromConfig = function(prompt) {
            var configValue = this.config.get(prompt.name)

            if (configValue !== undefined) {
                prompt['default'] = configValue
            }

            return prompt
        }

        var prompts = _.map([
            { type: 'input', name: 'PROJECT_NAME', message: 'Project name', default: 'e-comm' },

            { type: 'input', name: 'TOOL_NAME', message: 'Tool name', default: 'E-Comm' },
            { type: 'input', name: 'TOOL_PORT', message: 'Port', default: 5000 },

            { type: 'input', name: 'DB_HOST', message: 'Database host', default: 'localhost' },
            { type: 'input', name: 'DB_NAME', message: 'Database name', default: 'ecomm'}
        ], tryToReloadPromptFromConfig.bind(this))

        return this.prompt(prompts)
            .then(function(answers) {
                this.PROJECT_NAME = answers.PROJECT_NAME

                this.TOOL_NAME = answers.TOOL_NAME
                this.TOOL_PORT = answers.TOOL_PORT

                this.DB_HOST = answers.DB_HOST
                this.DB_NAME = answers.DB_NAME
            }.bind(this))
    },

    configuring: function() {
        this.config.set('PROJECT_NAME', this.PROJECT_NAME)

        this.config.set('TOOL_NAME', this.TOOL_NAME)
        this.config.set('TOOL_PORT', this.TOOL_PORT)

        this.config.set('DB_HOST', this.DB_HOST)
        this.config.set('DB_NAME', this.DB_NAME)

        this.config.save()
    },

    writing: {
        init: function() {
            this.log('Initializing project: ' + this.TOOL_NAME);
        },

        appStaticFiles: function() {
            this.log('Copy static resources')

            this.copy('.bowerrc', '.bowerrc')
            this.copy('.gitignore', '.gitignore')
            
            this.fs.copy([
                this.templatePath('**/*.ejs'),
                this.templatePath('**/img/*.*'),
                this.templatePath('**/swagger/**/*')],
                this.destinationPath())
        },

        templating: function() {
            this.log('Composing dynamic files')

            this.fs.copyTpl(
                [this.templatePath(),
                "!" + this.templatePath('**/*.ejs'),
                "!" + this.templatePath('**/img/*.*'),
                "!" + this.templatePath('**/swagger/**/*')],
                this.destinationPath(),
                {
                    PROJECT_NAME: this.PROJECT_NAME,

                    TOOL_NAME: this.TOOL_NAME,
                    TOOL_PORT: this.TOOL_PORT,

                    DB_HOST: this.DB_HOST,
                    DB_NAME: this.DB_NAME,

                    SECRET_CRYPTO: Math.random().toString(36).substring(7),
                    SECRET_JWT: Math.random().toString(36).substring(7)
                }
            )
        }
    },

    installingDeps: function() {
        this.log('Installing dependencies')

        this.installDependencies({
            npm: true,
            bower: false,
            callback: () => {
                this.log('Running bower')                

                this.spawnCommandSync('node_modules/.bin/bower', ['install']);

                this.log('Running gulp')                

                this.spawnCommandSync('node_modules/.bin/gulp', []);
            }
        });
    }
});
