/**
 * Automated technical-debt scan for the INSUREitALL TanStack tree.
 *
 * Combines a human ledger (src/lib/debt.ledger.json) with live detectors:
 * markers, rolled-back files, required legal routes, hardcoded avatars.
 *
 *   node scripts/debt-scan.mjs
 *   node scripts/debt-scan.mjs --json
 *   node scripts/debt-scan.mjs --strict   # exit 2 if live P0 findings
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_ROOT = join(HERE, "..");

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".output",
  ".git",
  ".vercel",
  "artifacts",
  "attachments",
  "screenshots",
]);

const MARKER_RE = /\b(TODO|FIXME|HACK|XXX|TECHDEBT|DEBT):/i;
const AVATAR_RE = /\/brand\/bridget\/avatar-[a-z0-9._-]+/gi;
const FORBIDDEN_FILES = [
  "src/components/bridget-cutout.tsx",
  "src/hooks/use-parallax.ts",
];
const FORBIDDEN_PATTERNS = [
  { id: "DoorTransition", re: /\bDoorTransition\b/ },
  { id: "PageDieCut", re: /\bPageDieCut\b/ },
  { id: "diecut-stage", re: /\bdiecut-stage\b/ },
];
const REQUIRED_FILES = [
  "src/routes/privacy.tsx",
  "src/routes/terms.tsx",
  "src/routes/ai-disclosure.tsx",
  "src/routes/accessibility.tsx",
  "src/routes/hipaa.tsx",
  "src/routes/glba.tsx",
  "src/routes/security.tsx",
  "src/lib/bridget-assets.ts",
  "src/lib/compliance.ts",
  "src/lib/hipaa.ts",
  "src/lib/glba.ts",
  "src/lib/isp.ts",
];
const SCAN_EXTS = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".md"]);

const PATTERN_PLAYBOOK = {
  DoorTransition: "door-transition",
  PageDieCut: "cutout-rollback",
  "diecut-stage": "cutout-rollback",
};

const FILE_PLAYBOOK = {
  "src/components/bridget-cutout.tsx": "cutout-rollback",
  "src/hooks/use-parallax.ts": "cutout-rollback",
};

export function loadP0Playbooks(root = DEFAULT_ROOT) {
  const local = join(root, "src/lib/debt.p0.json");
  const fallback = join(DEFAULT_ROOT, "src/lib/debt.p0.json");
  const path = existsSync(local) ? local : fallback;
  const data = JSON.parse(readFileSync(path, "utf8"));
  const list = data.playbooks ?? [];
  return Object.fromEntries(list.map((p) => [p.id, p]));
}

export function remediateFinding(finding, playbooks) {
  let playbookId = finding.playbookId;
  if (!playbookId && finding.source === "forbidden") {
    playbookId = FILE_PLAYBOOK[finding.file] ?? PATTERN_PLAYBOOK[finding.id.split(":")[1]];
  }
  if (!playbookId && finding.source === "required") playbookId = "legal-pages";
  if (!playbookId && finding.source === "ledger" && finding.id.startsWith("ledger-reopen:")) {
    playbookId = finding.id.slice("ledger-reopen:".length);
  }
  const book = playbookId ? playbooks[playbookId] : undefined;
  if (!book) return { ...finding, playbookId: playbookId ?? null, remediation: [] };
  const fileSteps = finding.file && book.files ? book.files[finding.file] : undefined;
  return {
    ...finding,
    playbookId,
    remediation: fileSteps ?? book.steps,
    verify: book.verify,
    doneWhen: book.doneWhen,
  };
}

export function loadLedger(root = DEFAULT_ROOT) {
  const path = join(root, "src/lib/debt.ledger.json");
  const data = JSON.parse(readFileSync(path, "utf8"));
  return data;
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function rel(root, file) {
  return relative(root, file).replaceAll("\\", "/");
}

export function collectMarkers(root = DEFAULT_ROOT) {
  const findings = [];
  const src = join(root, "src");
  for (const file of walk(src)) {
    const r = rel(root, file);
    if (r.endsWith("routeTree.gen.ts")) continue;
    if (r.includes("/lib/debt")) continue;
    const ext = file.slice(file.lastIndexOf("."));
    if (!SCAN_EXTS.has(ext)) continue;
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (!MARKER_RE.test(line)) return;
      findings.push({
        id: `marker:${r}:${i + 1}`,
        title: `${r}:${i + 1} ${line.trim().slice(0, 80)}`,
        severity: "p2",
        status: "open",
        area: "infra",
        source: "marker",
        file: r,
        line: i + 1,
      });
    });
  }
  return findings;
}

export function collectForbidden(root = DEFAULT_ROOT) {
  const findings = [];
  for (const file of FORBIDDEN_FILES) {
    if (existsSync(join(root, file))) {
      findings.push({
        id: `forbidden:${file}`,
        title: `Rolled-back file is back: ${file}`,
        severity: "p0",
        status: "open",
        area: "brand",
        source: "forbidden",
        file,
      });
    }
  }
  const src = join(root, "src");
  for (const file of walk(src)) {
    const r = rel(root, file);
    if (r.endsWith("routeTree.gen.ts") || r.includes("/lib/debt")) continue;
    const ext = file.slice(file.lastIndexOf("."));
    if (!SCAN_EXTS.has(ext)) continue;
    const text = readFileSync(file, "utf8");
    for (const pat of FORBIDDEN_PATTERNS) {
      if (pat.re.test(text)) {
        findings.push({
          id: `forbidden:${pat.id}:${r}`,
          title: `Rolled-back pattern ${pat.id} in ${r}`,
          severity: "p0",
          status: "open",
          area: "brand",
          source: "forbidden",
          file: r,
        });
      }
    }
  }
  return findings;
}

export function collectMissingRequired(root = DEFAULT_ROOT) {
  return REQUIRED_FILES.filter((file) => !existsSync(join(root, file))).map((file) => ({
    id: `missing:${file}`,
    title: `Required file missing: ${file}`,
    severity: "p0",
    status: "open",
    area: "compliance",
    source: "required",
    file,
  }));
}

export function collectHardcodedAvatars(root = DEFAULT_ROOT) {
  const findings = [];
  const src = join(root, "src");
  for (const file of walk(src)) {
    const r = rel(root, file);
    if (r === "src/lib/bridget-assets.ts") continue;
    if (r.includes("/lib/debt")) continue;
    const ext = file.slice(file.lastIndexOf("."));
    if (!SCAN_EXTS.has(ext)) continue;
    const text = readFileSync(file, "utf8");
    const matches = text.match(AVATAR_RE);
    if (!matches) continue;
    findings.push({
      id: `avatar:${r}`,
      title: `Hardcoded BRIDGEt avatar path in ${r}`,
      severity: "p1",
      status: "open",
      area: "brand",
      source: "avatar",
      file: r,
      detail: [...new Set(matches)].join(", "),
    });
  }
  return findings;
}

function conditionHolds(clearsWhen, root, extras) {
  if (!clearsWhen) return null;
  if (clearsWhen.missingFile) {
    return !existsSync(join(root, clearsWhen.missingFile));
  }
  if (clearsWhen.fileExists) {
    return existsSync(join(root, clearsWhen.fileExists));
  }
  if (clearsWhen.filesExist) {
    return clearsWhen.filesExist.every((f) => existsSync(join(root, f)));
  }
  if (clearsWhen.missingPattern) {
    return !extras.forbidden.some((f) => f.id.includes(clearsWhen.missingPattern));
  }
  if (clearsWhen.noHardcodedAvatars) {
    return extras.avatars.length === 0;
  }
  return null;
}

export function evaluateLedger(ledger, extras, root = DEFAULT_ROOT) {
  const drift = [];
  for (const item of ledger.items ?? []) {
    const held = conditionHolds(item.clearsWhen, root, extras);
    if (held === null) continue;
    if (item.status === "resolved" && held === false) {
      drift.push({
        id: `ledger-reopen:${item.id}`,
        title: `Resolved item returned: ${item.title}`,
        severity: item.severity,
        status: "open",
        area: item.area,
        source: "ledger",
        file: item.clearsWhen?.missingFile ?? item.id,
      });
    }
    if (item.status === "open" && held === true) {
      drift.push({
        id: `ledger-stale:${item.id}`,
        title: `Open item looks cleared: ${item.title} — mark resolved in the ledger`,
        severity: "p3",
        status: "open",
        area: item.area,
        source: "ledger",
      });
    }
  }
  return drift;
}

export function scanWorkspace(root = DEFAULT_ROOT) {
  const ledger = loadLedger(root);
  const playbooks = loadP0Playbooks(root);
  const extras = {
    markers: collectMarkers(root),
    forbidden: collectForbidden(root),
    missing: collectMissingRequired(root),
    avatars: collectHardcodedAvatars(root),
  };
  extras.ledgerDrift = evaluateLedger(ledger, extras, root);
  const live = [
    ...extras.forbidden,
    ...extras.missing,
    ...extras.avatars,
    ...extras.markers,
    ...extras.ledgerDrift,
  ].map((f) => (f.severity === "p0" ? remediateFinding(f, playbooks) : f));
  const openLedger = (ledger.items ?? []).filter((i) => i.status !== "resolved");
  const p0 = live.filter((f) => f.severity === "p0");
  return {
    scannedAt: new Date().toISOString(),
    root,
    ledgerUpdated: ledger.updated,
    ledger: ledger.items ?? [],
    openLedger,
    live,
    p0,
    counts: {
      ledgerOpen: openLedger.length,
      live: live.length,
      p0: p0.length,
      p1: live.filter((f) => f.severity === "p1").length,
      markers: extras.markers.length,
    },
  };
}

export function formatReport(report) {
  const lines = [
    `INSUREitALL debt scan  ${report.scannedAt}`,
    `Ledger ${report.ledgerUpdated} · open ${report.counts.ledgerOpen} · live findings ${report.counts.live}`,
    "",
  ];
  if (report.live.length === 0) {
    lines.push("No live detector findings.");
  } else {
    for (const f of report.live) {
      lines.push(`[${f.severity}] ${f.title}`);
      if (f.severity === "p0" && f.remediation?.length) {
        lines.push("  Fix:");
        f.remediation.forEach((step, i) => {
          lines.push(`    ${i + 1}. ${step}`);
        });
        if (f.verify) lines.push(`  Verify: ${f.verify}`);
      }
    }
  }
  lines.push("");
  lines.push("Open ledger:");
  for (const item of report.openLedger) {
    lines.push(`  ${item.severity}  ${item.id}  ${item.title}`);
  }
  return lines.join("\n");
}

function isMain() {
  const self = fileURLToPath(import.meta.url);
  const invoked = process.argv[1] ? join(process.argv[1]) : "";
  return self === invoked || self.endsWith("debt-scan.mjs") && process.argv[1]?.endsWith("debt-scan.mjs");
}

if (isMain()) {
  const json = process.argv.includes("--json");
  const strict = process.argv.includes("--strict");
  const report = scanWorkspace();
  const outDir = join(DEFAULT_ROOT, "debt");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "latest.json"), JSON.stringify(report, null, 2));
  if (json) console.log(JSON.stringify(report, null, 2));
  else console.log(formatReport(report));
  if (strict && report.counts.p0 > 0) process.exit(2);
}
