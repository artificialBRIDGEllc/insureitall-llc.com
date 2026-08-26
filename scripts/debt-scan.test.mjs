import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import {
  collectForbidden,
  collectHardcodedAvatars,
  collectMarkers,
  collectMissingRequired,
  evaluateLedger,
  formatReport,
  remediateFinding,
  scanWorkspace,
} from "./debt-scan.mjs";

const LEDGER = {
  updated: "2026-08-25",
  items: [
    {
      id: "cutout-rollback",
      title: "Die-cut",
      severity: "p0",
      status: "resolved",
      area: "brand",
      why: "rolled back",
      next: "keep gone",
      clearsWhen: { missingFile: "src/components/bridget-cutout.tsx" },
    },
    {
      id: "legal-pages",
      title: "Legal",
      severity: "p0",
      status: "resolved",
      area: "compliance",
      why: "required",
      next: "keep",
      clearsWhen: {
        filesExist: [
          "src/routes/privacy.tsx",
          "src/routes/terms.tsx",
          "src/routes/ai-disclosure.tsx",
          "src/routes/accessibility.tsx",
          "src/routes/hipaa.tsx",
          "src/routes/glba.tsx",
          "src/routes/security.tsx",
        ],
      },
    },
  ],
};

function seed(root, files) {
  mkdirSync(join(root, "src/lib"), { recursive: true });
  writeFileSync(join(root, "src/lib/debt.ledger.json"), JSON.stringify(LEDGER));
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(root, dirname(path)), { recursive: true });
    writeFileSync(join(root, path), body);
  }
}

function legalFiles() {
  return {
    "src/routes/privacy.tsx": "export {}",
    "src/routes/terms.tsx": "export {}",
    "src/routes/ai-disclosure.tsx": "export {}",
    "src/routes/accessibility.tsx": "export {}",
    "src/routes/hipaa.tsx": "export {}",
    "src/routes/glba.tsx": "export {}",
    "src/routes/security.tsx": "export {}",
    "src/lib/bridget-assets.ts": "export const BRIDGET_AVATAR = {}",
    "src/lib/compliance.ts": "export {}",
    "src/lib/hipaa.ts": "export {}",
    "src/lib/glba.ts": "export {}",
    "src/lib/isp.ts": "export {}",
  };
}

test("forbidden cutout file is P0", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, {
    ...legalFiles(),
    "src/components/bridget-cutout.tsx": "export function BridgetCutout() {}",
  });
  const found = collectForbidden(root);
  assert.equal(found.some((f) => f.file === "src/components/bridget-cutout.tsx"), true);
  assert.equal(found[0].severity, "p0");
});

test("DoorTransition pattern is P0", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, {
    ...legalFiles(),
    "src/components/site-shell.tsx": "export function DoorTransition() { return null }",
  });
  const found = collectForbidden(root);
  assert.equal(found.some((f) => f.title.includes("DoorTransition")), true);
});

test("missing legal route is required finding", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, {
    "src/lib/bridget-assets.ts": "",
    "src/lib/compliance.ts": "",
  });
  const found = collectMissingRequired(root);
  assert.equal(found.some((f) => f.file === "src/routes/privacy.tsx"), true);
});

test("hardcoded avatar outside bridget-assets is P1", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, {
    ...legalFiles(),
    "src/routes/index.tsx": 'const src = "/brand/bridget/avatar-bust.png"',
  });
  const found = collectHardcodedAvatars(root);
  assert.equal(found.length, 1);
  assert.equal(found[0].severity, "p1");
});

test("bridget-assets.ts is allowed to name avatar files", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, legalFiles());
  assert.deepEqual(collectHardcodedAvatars(root), []);
});

test("TODO markers are collected", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, {
    ...legalFiles(),
    "src/lib/ops.ts": "// TODO: wire redis\nexport {}",
  });
  const found = collectMarkers(root);
  assert.equal(found.length, 1);
  assert.match(found[0].title, /ops.ts:1/);
});

test("resolved ledger item reopens if the file returns", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, {
    ...legalFiles(),
    "src/components/bridget-cutout.tsx": "export {}",
  });
  const extras = {
    forbidden: collectForbidden(root),
    avatars: [],
  };
  const drift = evaluateLedger(LEDGER, extras, root);
  assert.equal(drift.some((d) => d.id === "ledger-reopen:cutout-rollback"), true);
});

test("workspace scan writes a report with counts", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, legalFiles());
  const report = scanWorkspace(root);
  assert.equal(typeof report.scannedAt, "string");
  assert.equal(report.counts.p0, 0);
  const text = formatReport(report);
  assert.match(text, /INSUREitALL debt scan/);
  assert.match(text, /No live detector findings/);
});

test("P0 cutout finding includes numbered restore steps", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, {
    ...legalFiles(),
    "src/components/bridget-cutout.tsx": "export function BridgetCutout() {}",
  });
  const report = scanWorkspace(root);
  const hit = report.p0.find((f) => f.file === "src/components/bridget-cutout.tsx");
  assert.ok(hit);
  assert.equal(hit.playbookId, "cutout-rollback");
  assert.ok(hit.remediation.length >= 4);
  assert.match(hit.remediation[0], /Delete src\/components\/bridget-cutout/);
  assert.match(hit.verify, /debt:strict/);
  const text = formatReport(report);
  assert.match(text, /Fix:/);
  assert.match(text, /1\. Delete src\/components\/bridget-cutout/);
});

test("missing privacy page uses the file-specific playbook", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, {
    "src/routes/terms.tsx": "export {}",
    "src/routes/ai-disclosure.tsx": "export {}",
    "src/routes/accessibility.tsx": "export {}",
    "src/lib/bridget-assets.ts": "",
    "src/lib/compliance.ts": "",
  });
  const report = scanWorkspace(root);
  const hit = report.p0.find((f) => f.file === "src/routes/privacy.tsx");
  assert.ok(hit);
  assert.equal(hit.playbookId, "legal-pages");
  assert.match(hit.remediation[0], /privacy\.tsx/);
  assert.match(hit.remediation.join(" "), /NPN 20114179/);
});

test("DoorTransition finding maps to the door playbook", () => {
  const root = mkdtempSync(join(tmpdir(), "debt-"));
  seed(root, {
    ...legalFiles(),
    "src/components/site-shell.tsx": "export function DoorTransition() { return null }",
  });
  const report = scanWorkspace(root);
  const hit = report.p0.find((f) => f.title.includes("DoorTransition"));
  assert.ok(hit);
  assert.equal(hit.playbookId, "door-transition");
  assert.match(hit.remediation[0], /DoorTransition/);
  assert.match(hit.remediation.join(" "), /BrandSplash/);
});

test("remediateFinding is a no-op for unknown P1 sources", () => {
  const out = remediateFinding(
    { id: "avatar:x", severity: "p1", source: "avatar", file: "src/a.tsx" },
    {},
  );
  assert.deepEqual(out.remediation, []);
});

