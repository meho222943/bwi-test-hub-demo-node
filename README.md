# node-test-demo

Node.js + built-in `node:test` demo for the **BWI Test Hub**. Register
the clone URL and run — no Docker needed (runs via DIRECT_PROCESS, needs
only `node` >= 20). `run.mjs` runs the suite with the native JUnit
reporter and derives an HTML report.

Make it fail: change an `assert` in `tests/calc.test.mjs`.

## Running locally

Requires Node.js >= 20. No `npm install` is needed: the suite and
`run.mjs` use only Node built-ins (there is no `package.json`).

Run the tests with the default console reporter:

```sh
node --test
```

Node auto-discovers `tests/*.test.mjs`. Don't pass `tests/` as an
argument, because Node would then try to load the directory as a module.

Run the suite the way the Test Hub does, with reports:

```sh
node run.mjs
```

This writes two files to `report/` in the repository root. The directory
is created if it is missing and is git-ignored.

- `report/junit.xml`: JUnit results from Node's native `junit` reporter.
- `report/index.html`: a self-contained HTML report built from
  `junit.xml`. Open it in a browser.

`run.mjs` prints a `passed/total` summary line. It exits with the test
runner's status, so the exit code is non-zero if any test fails.
