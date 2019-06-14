testem-gitlab-reporter
==============================================================================

[GitLab/JUnit] reporter for [testem]

[GitLab/JUnit]: https://docs.gitlab.com/ee/ci/junit_test_reports.html
[testem]: https://github.com/testem/testem


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
