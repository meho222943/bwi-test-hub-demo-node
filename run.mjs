// Runs the Node built-in test runner, writes report/junit.xml via the
// native junit reporter, then derives a polished, self-contained HTML
// report from it. Dependency-free (Node >= 20): no npm install.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync("report", { recursive: true });

// No path argument: Node auto-discovers files named *.test.mjs
// (passing "tests/" would make Node try to load it as a module).
const startedAt = Date.now();
const run = spawnSync(
  process.execPath,
  ["--test", "--test-reporter=junit",
   "--test-reporter-destination=report/junit.xml"],
  { stdio: "inherit" }
);
const duration = ((Date.now() - startedAt) / 1000).toFixed(2);

// Derive HTML from the junit the runner just wrote.
const xml = readFileSync("report/junit.xml", "utf8");
const cases = [...xml.matchAll(/<testcase\b[^>]*\bname="([^"]*)"[\s\S]*?(?:\/>|<\/testcase>)/g)]
  .map((m) => {
    const failed = /<failure/.test(m[0]);
    const msgMatch = m[0].match(/<failure\b[^>]*\bmessage="([^"]*)"/);
    return { name: m[1], failed, message: msgMatch ? msgMatch[1] : "" };
  });
const total = cases.length;
const failed = cases.filter((c) => c.failed).length;
const passed = total - failed;

writeReport({
  project: "node:test",
  subtitle: "Node.js 22 &middot; node:test &middot; BWI Test Hub demo",
  runtime: "node-22 (container)",
  total, passed, failed, duration, cases,
});

console.log(`node:test: ${passed}/${total} passed, ${failed} failed`);
process.exit(run.status ?? 1);

function writeReport({ project, subtitle, runtime, total, passed, failed, duration, cases }) {
  const esc = (s) => String(s).replace(/[<&>]/g, (c) => ({ "<": "&lt;", "&": "&amp;", ">": "&gt;" }[c]));
  const status = failed === 0 ? "PASSED" : "FAILED";
  const scls = failed === 0 ? "ok" : "no";
  const pct = total ? Math.round((passed * 100) / total) : 0;
  const generated = new Date().toISOString().slice(0, 19).replace("T", " ");
  const rows = cases.map((c) => {
    const chip = c.failed
      ? `<span class="chip no">&#10007; failed</span>${c.message ? `<div class="msg">${esc(c.message)}</div>` : ""}`
      : `<span class="chip ok">&#10003; passed</span>`;
    return `<tr><td class="name">${esc(c.name)}</td><td>${chip}</td></tr>`;
  }).join("");

  writeFileSync("report/index.html", `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(project)} &mdash; Test Report</title>
<style>
:root{--bg:#0b1120;--panel:#111a2e;--panel2:#0f1728;--border:#1e2a44;--text:#e6ecf7;--muted:#8ea0c0;--ok:#22c55e;--no:#ef4444}
*{box-sizing:border-box}
body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:radial-gradient(1200px 600px at 20% -10%,#16223f 0%,var(--bg) 55%);color:var(--text);padding:2.5rem 1.25rem;min-height:100vh}
.wrap{max-width:920px;margin:0 auto}
.head{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;justify-content:space-between;margin-bottom:1.75rem}
.title h1{margin:0;font-size:1.6rem;letter-spacing:-.02em}
.title p{margin:.35rem 0 0;color:var(--muted);font-size:.95rem}
.pill{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:999px;font-weight:700;font-size:.95rem;color:#fff}
.pill.ok{background:linear-gradient(135deg,#16a34a,#22c55e);box-shadow:0 6px 20px -6px rgba(34,197,94,.55)}
.pill.no{background:linear-gradient(135deg,#dc2626,#ef4444);box-shadow:0 6px 20px -6px rgba(239,68,68,.55)}
.dot{width:.6rem;height:.6rem;border-radius:50%;background:#fff}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:.9rem;margin-bottom:1.5rem}
.card{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--border);border-radius:14px;padding:1rem 1.1rem}
.card .k{color:var(--muted);font-size:.72rem;text-transform:uppercase;letter-spacing:.08em}
.card .v{font-size:1.7rem;font-weight:700;margin-top:.25rem}
.card.ok .v{color:var(--ok)}.card.no .v{color:var(--no)}
.bar{height:.5rem;border-radius:999px;background:#1e2a44;overflow:hidden;margin-bottom:1.75rem}
.bar>i{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#4ade80)}
table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--border);border-radius:14px;overflow:hidden}
th,td{padding:.8rem 1rem;text-align:left;font-size:.92rem;vertical-align:top}
thead th{background:#0e1626;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:.72rem}
tbody tr{border-top:1px solid var(--border)}
tbody tr:hover{background:#0e1830}
td.name{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.chip{display:inline-flex;align-items:center;gap:.4rem;padding:.2rem .6rem;border-radius:999px;font-size:.78rem;font-weight:600}
.chip.ok{color:#bbf7d0;background:#14351f;border:1px solid #1f5133}
.chip.no{color:#fecaca;background:#3a1618;border:1px solid #5b2327}
.msg{color:#fca5a5;font-family:ui-monospace,monospace;font-size:.82rem;margin-top:.35rem}
.foot{color:var(--muted);font-size:.82rem;margin-top:1.25rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem}
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <div class="title"><h1>${esc(project)}</h1><p>${subtitle}</p></div>
    <span class="pill ${scls}"><span class="dot"></span>${status}</span>
  </div>
  <div class="cards">
    <div class="card"><div class="k">Total</div><div class="v">${total}</div></div>
    <div class="card ok"><div class="k">Passed</div><div class="v">${passed}</div></div>
    <div class="card no"><div class="k">Failed</div><div class="v">${failed}</div></div>
    <div class="card"><div class="k">Duration</div><div class="v">${duration}s</div></div>
  </div>
  <div class="bar"><i style="width:${pct}%"></i></div>
  <table>
    <thead><tr><th>Test</th><th>Result</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="foot"><span>Runtime: ${runtime}</span><span>Generated ${generated}</span></div>
</div>
</body>
</html>`);
}
