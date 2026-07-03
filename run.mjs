// Runs the Node built-in test runner, writes report/junit.xml via the
// native junit reporter, then derives a small HTML report from it.
// Dependency-free (Node >= 20): no npm install, runs via DIRECT_PROCESS.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync("report", { recursive: true });

// No path argument: Node auto-discovers files named *.test.mjs
// (passing "tests/" would make Node try to load it as a module).
const run = spawnSync(
  process.execPath,
  ["--test", "--test-reporter=junit",
   "--test-reporter-destination=report/junit.xml"],
  { stdio: "inherit" }
);

// Derive HTML from the junit the runner just wrote.
const xml = readFileSync("report/junit.xml", "utf8");
const cases = [...xml.matchAll(/<testcase\b[^>]*\bname="([^"]*)"[\s\S]*?(?:\/>|<\/testcase>)/g)]
  .map((m) => ({ name: m[1], failed: /<failure/.test(m[0]) }));
const total = cases.length;
const failed = cases.filter((c) => c.failed).length;
const passed = total - failed;
const status = failed === 0 ? "PASSED" : "FAILED";
const color = failed === 0 ? "#16a34a" : "#dc2626";
const esc = (s) => s.replace(/[<&>]/g, (c) => ({ "<": "&lt;", "&": "&amp;", ">": "&gt;" }[c]));
const rows = cases
  .map((c) => `<tr><td>${esc(c.name)}</td><td class="${c.failed ? "no" : "ok"}">${c.failed ? "failed" : "passed"}</td></tr>`)
  .join("\n");

writeFileSync("report/index.html", `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>node:test report</title>
<style>body{font-family:system-ui,sans-serif;margin:2rem;background:#0f172a;color:#e2e8f0}
.badge{display:inline-block;padding:.2rem .8rem;border-radius:999px;color:#fff;font-weight:700}
table{border-collapse:collapse;margin-top:1rem;width:100%}td,th{padding:.5rem .8rem;border-bottom:1px solid #334155;text-align:left}
.ok{color:#4ade80}.no{color:#f87171}</style></head><body>
<h1>node:test</h1>
<p>Status: <span class="badge" style="background:${color}">${status}</span> &middot; ${passed}/${total} passed</p>
<table><tr><th>Test</th><th>Result</th></tr>${rows}</table></body></html>`);

console.log(`node:test: ${passed}/${total} passed, ${failed} failed`);
process.exit(run.status ?? 1);
