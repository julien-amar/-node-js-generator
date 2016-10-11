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
            { type:'input', name: 'TOOLNAME', message: 'Tool name (eg: xxx)', default: this.appname},
            { type:'input', name: 'PORT', message: 'Port (eg: 8080)', default: 8080}
        ], tryToReloadPromptFromConfig.bind(this))

        return this.prompt(prompts)
            .then(function(answers) {
                this.TOOLNAME = answers.TOOLNAME
                this.PORT = answers.PORT
            }.bind(this))
    },

    configuring: function() {
        this.config.set('TOOLNAME', this.TOOLNAME)
        this.config.set('PORT', this.PORT)

        this.config.save()
    },

    writing: {
        init: function() {
            this.log('Initializing project: ' + this.TOOLNAME);
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
                    TOOLNAME: this.TOOLNAME,
                    PORT: this.PORT
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
