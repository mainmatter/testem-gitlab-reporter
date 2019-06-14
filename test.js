const GitLabReporter = require('./index');

describe('testem-gitlab-reporter', () => {
  test('generates JUnit test results file', () => {
    let stream = new MockStream();
    let reporter = new GitLabReporter(false, stream);

    reporter.report('Chrome 57', {
      name: 'Test 1',
      passed: true,
      failed: 0,
      skipped: false,
      runDuration: 15,
      logs: [],
      error: undefined,
    });
    reporter.report('Chrome 57', {
      name: 'Test 2',
      passed: true,
      failed: 0,
      skipped: false,
      runDuration: 13,
      logs: [],
      error: undefined,
    });
    reporter.report('Chrome 57', {
      name: 'Test 3',
      passed: false,
      failed: 0,
      skipped: true,
      runDuration: undefined,
      logs: [],
      error: undefined,
    });
    reporter.report('Chrome 57', {
      name: 'Test 4',
      passed: true,
      failed: 0,
      skipped: false,
      runDuration: 123,
      logs: [],
      error: undefined,
    });
    reporter.report('Chrome 57', {
      name: 'Test 5',
      passed: false,
      failed: 1,
      skipped: false,
      runDuration: 42,
      logs: [{ type: 'log', text: "'this is a test'\n" }],
      error: {
        passed: false,
        actual: 'My Big Fat Greek Wedding',
        expected: 'My Big Fat Greek Funeral',
        stack: '[stack hidden - error is assertion error]',
        negative: false,
        message:
          'Assertion failure without message - Actual: My Big Fat Greek Wedding Expected: My Big Fat Greek Funeral',
      },
    });
    reporter.finish();

    expect(stream.output).toMatchInlineSnapshot(`
      "<?xml version=\\"1.0\\"?>
      <testsuite tests=\\"4\\" failures=\\"1\\">
        <testcase name=\\"Test 1\\" time=\\"0.015\\"/>
        <testcase name=\\"Test 2\\" time=\\"0.013\\"/>
        <testcase name=\\"Test 4\\" time=\\"0.123\\"/>
        <testcase name=\\"Test 5\\" time=\\"0.042\\">
          <failure>Assertion failure without message - Actual: My Big Fat Greek Wedding Expected: My Big Fat Greek Funeral</failure>
        </testcase>
      </testsuite>"
    `);
  });
});

class MockStream {
  constructor() {
    this._output = '';
  }

  write(output) {
    this._output += output;
  }

  get output() {
    return this._output;
  }
}
