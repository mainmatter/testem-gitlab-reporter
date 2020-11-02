testem-gitlab-reporter
==============================================================================

[![TravisCI Build Status][travis-badge]][travis-badge-url]
[![Latest NPM release][npm-badge]][npm-badge-url]

[npm-badge]: https://img.shields.io/npm/v/testem-gitlab-reporter.svg
[npm-badge-url]: https://www.npmjs.com/package/testem-gitlab-reporter
[travis-badge]: https://img.shields.io/travis/simplabs/testem-gitlab-reporter/master.svg
[travis-badge-url]: https://travis-ci.org/simplabs/testem-gitlab-reporter

[GitLab/JUnit] reporter for [testem]

[GitLab/JUnit]: https://docs.gitlab.com/ee/ci/junit_test_reports.html
[testem]: https://github.com/testem/testem

GitLab requires the JUnit format for test results. testem comes with an xUnit
reporter. Unfortunately, even though the formats look quite similar there are
some differences which make them incompatible in the context of GitLab CI.
testem-gitlab-reporter is a testem reporter that specifically targets the format
that is expected by GitLab CI.


Install
------------------------------------------------------------------------------

```bash
npm install testem-gitlab-reporter
```


Usage
------------------------------------------------------------------------------

Change your `testem.js` file to use the testem-gitlab-reporter package. If
you would like to keep the existing TAP console output you can use the
[testem-multi-reporter] package to take advantage of multiple reporters: 

```js
const MultiReporter = require('testem-multi-reporter');
const GitLabReporter = require('testem-gitlab-reporter');
const TAPReporter = require('testem/lib/reporters/tap_reporter');
const fs = require('fs');

let reporter = new MultiReporter({
  reporters: [
    {
      ReporterClass: TAPReporter,
      args: [false, null, { get: () => false }],
    },
    {
      ReporterClass: GitLabReporter,
      args: [false, fs.createWriteStream('junit.xml'), { get: () => false }],
    },
  ],
});

module.exports = {
  framework: 'qunit',
  test_page: 'tests/index.html?hidepassed&coverage',
  disable_watching: true,
  launch_in_ci: [
    'Chrome'
  ],
  reporter
};
```

Running testem (or `ember test`) now will create a `junit.xml` file, which can
be passed to GitLab as described in the [GitLab docs](https://docs.gitlab.com/ee/ci/junit_test_reports.html).

[testem-multi-reporter]: https://github.com/xdumaine/testem-multi-reporter


License
------------------------------------------------------------------------------

This project is developed by and &copy; [simplabs GmbH](http://simplabs.com)
and contributors. It is released under the [MIT License](LICENSE.md).
