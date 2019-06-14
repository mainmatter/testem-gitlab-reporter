'use strict';

const builder = require('xmlbuilder');

class GitLabJUnitReporter {
  constructor(silent, out) {
    this.out = out || process.stdout;
    this.silent = silent;

    this.results = [];
  }

  report(launcher, data) {
    this.results.push({ launcher, data });
  }

  finish() {
    if (this.silent) {
      return;
    }

    this.out.write(this._formatOutput());
  }

  _formatOutput() {
    let root = builder.create('testsuite');

    root.attribute('tests', this.results.filter(it => !it.data.skipped).length);
    root.attribute('failures', this.results.filter(it => it.data.failed).length);

    for (let { data } of this.results) {
      if (data.skipped) {
        continue;
      }

      let el = root.element('testcase');
      el.attribute('name', data.name);
      el.attribute('time', durationFromMs(data.runDuration));

      if (data.error) {
        let failure = el.element('failure');
        failure.text(data.error.message);
      }
    }

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
