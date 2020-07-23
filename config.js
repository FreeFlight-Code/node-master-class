/**
 * Create and export configuration variables
 */

 // Container for all the environments

var environments = {};

// Staging environment
environments.staging = {
	'httpPort': 3000,
	'httpsPort': 3001,
	'envName': 'staging'
};

// Production environment
environments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': "production",
};

// Determine which one should be exported out from command line
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

var environmentToExport = environments.hasOwnProperty(currentEnvironment) ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport