module.exports = function(config){
  var configuration = {

    basePath : '../',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/mathjs/dist/math.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],
	
	customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  };
  
  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }
  
  config.set(configuration);
};
