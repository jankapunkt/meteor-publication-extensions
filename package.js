/* global Package */

Package.describe({
  name: 'jkuester:publication-extensions',
  version: '0.2.0',
  // Brief, one-line summary of the package.
  summary: 'Pause or stop publications, set timeouts, set maximum times of publication runs.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jankapunkt/meteor-publication-extensions.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.5')
  api.use('ecmascript')
  api.use('meteor')
  api.use('mongo')
  api.addFiles('publication-extensions.js', 'server')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('jkuester:publication-extensions')
  api.mainModule('publication-extensions-tests.js')
})
