# node-test-demo

Node.js + built-in `node:test` demo for the **BWI Test Hub**. Register
the clone URL and run — no Docker needed (runs via DIRECT_PROCESS, needs
only `node` >= 20). `run.mjs` runs the suite with the native JUnit
reporter and derives an HTML report.

Make it fail: change an `assert` in `tests/calc.test.mjs`.
