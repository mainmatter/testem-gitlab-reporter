'use strict';

const builder = require('xmlbuilder');

class GitLabJUnitReporter {
  constructor(silent, out) {
    this.out = out || process.stdout;
    this.silent = silent;

    this.results = {};
  }

  report(launcher, data) {
    if (!this.results[launcher]) {
      this.results[launcher] = [];
    }

    this.results[launcher].push({ data });
  }

  finish() {
    if (this.silent) {
      return;
    }

    this.out.write(this._formatOutput());
  }

  _formatOutput() {
    let root = builder.create('testsuites');

    var totals = Object.keys(this.results).reduce((previous, browser) => {
      let suite = root.element('testsuite');
      suite.attribute('name', browser);
      var result = this.results[browser];

      suite.attribute('tests', result.length);
      suite.attribute('failures', result.filter(it => it.data.failed).length);
      suite.attribute('skipped', result.filter(it => it.data.skipped).length);

      for (let { data } of result) {
        let el = suite.element('testcase');

        let name = data.name;
        let className = name;

        const firstColon = name.indexOf(':');

        if (firstColon !== -1) {
          className = className.substring(0, firstColon);
          name = name.substring(firstColon + 2);
        }

        el.attribute('name', name);
        el.attribute('classname', `[${browser}] ${className}`);

        if (data.skipped) {
          let skipped = el.element('skipped');
          continue;
        }

        el.attribute('time', durationFromMs(data.runDuration));

        if (data.logs && data.logs.length) {
          let output = el.element('system-out');
          output.text(JSON.stringify(data.logs, null, '\t'));
        }

        if (data.error) {
          let failure = el.element('failure');
          failure.text(data.error.message);

          let stderr = el.element('system-err');
          stderr.text(JSON.stringify(data.error, null, '\t'));
        }
      }

      return {
        failures: previous.failures + result.filter(it => it.data.failed).length,
        skipped: previous.skipped + result.filter(it => it.data.skipped).length,
        tests: previous.tests + result.length,
      };
    }, {
      tests: 0,
      failures: 0,
      skipped: 0
    });

    return root.end({ pretty: true });
  }
}

function durationFromMs(ms) {
  if (ms) {
    return (ms / 1000).toFixed(3);
  } else {
    return 0;
  }
}

module.exports = GitLabJUnitReporter;
