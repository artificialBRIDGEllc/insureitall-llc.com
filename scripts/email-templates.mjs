/** Branded Resend HTML + text. Never include doctors, medications, or notes. */

export const BRAND_DEFAULTS = {
  SITE_NAME: "INSUREitALL",
  NPN: "20114179",
  HQ: "3550 Buschwood Park Dr, Ste 180, Tampa, FL 33618",
  HOURS: "Mon–Fri 9am–6pm ET",
  TTY: "TTY 711",
  PHONE_DISPLAY: "+1 888-459-4842",
  PHONE_HREF: "tel:+18884594842",
  NON_AFFILIATION:
    "Insure It All is not connected with or endorsed by the U.S. Government or the federal Medicare program.",
  SITE_ORIGIN: "https://insureitall-llc.com",
  CONSOLE_URL: "https://insureitall-llc.com/console",
  DESK_CTA: "Open the lead desk",
  CALL_CTA: "Call +1 888-459-4842",
  FOOTER_LICENSE: "Licensed agents",
  RECORDING:
    "Calls are recorded for quality, training, and compliance.",
  STOP_LINE: "This is not an enrollment. Consent was not a condition of purchase. Reply STOP to texts.",
  ALERT_INTRO: "A licensed agent needs to call. Doctors and medications are not in this email.",
  ALERT_CLOSE: "Call them. Do not wait on the desk.",
  RECEIVED_TITLE: "We have your request.",
  RECEIVED_BODY:
    "A licensed INSUREitALL agent will call during the window you chose. No scripts. No pressure.",
  RECEIVED_SOONER: "If you need someone sooner:",
};

const ENV_MAP = {
  EMAIL_SITE_NAME: "SITE_NAME",
  EMAIL_PHONE: "PHONE_DISPLAY",
  EMAIL_HOURS: "HOURS",
  EMAIL_CONSOLE_URL: "CONSOLE_URL",
  EMAIL_DESK_CTA: "DESK_CTA",
  EMAIL_CALL_CTA: "CALL_CTA",
  EMAIL_RECEIVED_TITLE: "RECEIVED_TITLE",
  EMAIL_RECEIVED_BODY: "RECEIVED_BODY",
};

export function brandVars(env = {}) {
  const out = { ...BRAND_DEFAULTS };
  for (const [key, dest] of Object.entries(ENV_MAP)) {
    const v = String(env[key] ?? "").trim();
    if (v) out[dest] = v;
  }
  if (env.EMAIL_PHONE) {
    const digits = String(env.EMAIL_PHONE).replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) out.PHONE_HREF = `tel:+${digits}`;
    else if (digits.length === 10) out.PHONE_HREF = `tel:+1${digits}`;
    if (!env.EMAIL_CALL_CTA) out.CALL_CTA = `Call ${out.PHONE_DISPLAY}`;
  }
  return out;
}

export function esc(value) {
  return String(value ?? "").replace(/[&<>"]/g, (ch) => {
    if (ch === "&") return "&" + "amp;";
    if (ch === "<") return "&" + "lt;";
    if (ch === ">") return "&" + "gt;";
    return "&" + "quot;";
  });
}

function kindLabel(kind) {
  return kind === "needs" ? "Needs analysis" : "Callback";
}

function wrap(brand, { title, preview, inner }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F7F4EE;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preview)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4EE;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0A1D3D;border-radius:24px 24px 0 0;">
          <tr>
            <td style="padding:28px 32px 8px;font-family:Georgia,'Times New Roman',serif;color:#F7F4EE;font-size:22px;letter-spacing:0.04em;">
              ${esc(brand.SITE_NAME)}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 20px;font-family:Georgia,'Times New Roman',serif;color:#C9A227;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;">
              ${esc(title)}
            </td>
          </tr>
        </table>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;">
          <tr>
            <td style="height:3px;background:#C9A227;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;font-family:Georgia,'Times New Roman',serif;color:#0A1D3D;font-size:26px;line-height:1.25;">
              ${esc(title)}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;font-family:Arial,Helvetica,sans-serif;color:#1a2332;font-size:16px;line-height:1.55;">
              ${inner}
            </td>
          </tr>
        </table>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0A1D3D;border-radius:0 0 24px 24px;">
          <tr>
            <td style="padding:20px 32px;font-family:Arial,Helvetica,sans-serif;color:#D6EBF8;font-size:12px;line-height:1.5;">
              ${esc(brand.FOOTER_LICENSE)} · NPN ${esc(brand.NPN)} · ${esc(brand.HQ)}<br />
              <a href="${esc(brand.PHONE_HREF)}" style="color:#C9A227;text-decoration:none;">${esc(brand.PHONE_DISPLAY)}</a>
              · ${esc(brand.TTY)} · ${esc(brand.HOURS)}<br />
              ${esc(brand.NON_AFFILIATION)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label, value) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;color:#6b7280;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;width:140px;vertical-align:top;">${esc(label)}</td>
    <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;color:#0A1D3D;font-size:16px;">${value}</td>
  </tr>`;
}

export function leadVars(payload, env = {}) {
  const brand = brandVars(env);
  const kind = kindLabel(payload.kind);
  const first = payload.firstName || "";
  return {
    ...brand,
    KIND: kind,
    KIND_LOWER: kind.toLowerCase(),
    FIRST_NAME: first || "there",
    PHONE: payload.phone || "",
    EMAIL: payload.email || "",
    ZIP: payload.zip || "",
    WINDOW: payload.callbackWindow || "",
    ID: payload.id || "",
    GREETING: first ? `Hello ${first}.` : "Hello.",
  };
}

export function leadAlertTemplate(payload, env = {}) {
  const v = leadVars(payload, env);
  const brand = brandVars(env);
  const subject = `${v.KIND} · ${payload.firstName || "request"} · ${v.ID}`;
  const preview = `${v.KIND} just landed. Call ${v.PHONE || v.PHONE_DISPLAY}.`;
  const phoneHtml = v.PHONE
    ? `<a href="tel:${esc(v.PHONE)}" style="color:#0072CE;text-decoration:none;">${esc(v.PHONE)}</a>`
    : "—";
  const emailHtml = v.EMAIL
    ? `<a href="mailto:${esc(v.EMAIL)}" style="color:#0072CE;text-decoration:none;">${esc(v.EMAIL)}</a>`
    : "—";
  const inner = `
    <p style="margin:0 0 16px;">${esc(v.ALERT_INTRO)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;margin:8px 0 20px;">
      ${row("ID", esc(v.ID))}
      ${row("Type", esc(v.KIND))}
      ${row("Name", esc(payload.firstName || "—"))}
      ${row("Phone", phoneHtml)}
      ${row("Email", emailHtml)}
      ${row("Zip", esc(v.ZIP || "—"))}
      ${row("Window", esc(v.WINDOW || "—"))}
    </table>
    <p style="margin:0 0 20px;">
      <a href="${esc(v.CONSOLE_URL)}" style="display:inline-block;background:#0072CE;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">${esc(v.DESK_CTA)}</a>
    </p>
    <p style="margin:0;color:#6b7280;font-size:13px;">${esc(v.ALERT_CLOSE)}</p>
  `;
  const text = [
    `${v.KIND} just landed.`,
    "",
    `ID: ${v.ID}`,
    `Name: ${payload.firstName || "—"}`,
    `Phone: ${v.PHONE || "—"}`,
    `Email: ${v.EMAIL || "—"}`,
    `Zip: ${v.ZIP || "—"}`,
    `Window: ${v.WINDOW || "—"}`,
    "",
    `Desk: ${v.CONSOLE_URL}`,
    v.ALERT_INTRO,
    v.ALERT_CLOSE,
  ].join("\n");
  return {
    alias: "insureitall-lead-alert",
    subject,
    preview,
    text,
    html: wrap(brand, { title: v.KIND, preview, inner }),
    variables: { ...v, SUBJECT: subject, PREVIEW: preview, FIRST_NAME: payload.firstName || "request" },
  };
}

export function leadReceivedTemplate(payload, env = {}) {
  const v = leadVars(payload, env);
  const brand = brandVars(env);
  const subject = `${v.RECEIVED_TITLE} — ${v.SITE_NAME}`;
  const preview = `A licensed agent will call. You can always reach us at ${v.PHONE_DISPLAY}.`;
  const inner = `
    <p style="margin:0 0 16px;">${esc(v.GREETING)}</p>
    <p style="margin:0 0 16px;">We have your ${esc(v.KIND_LOWER)}. ${esc(v.RECEIVED_BODY)}</p>
    <p style="margin:0 0 20px;">${esc(v.RECEIVED_SOONER)}</p>
    <p style="margin:0 0 20px;">
      <a href="${esc(v.PHONE_HREF)}" style="display:inline-block;background:#0072CE;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">${esc(v.CALL_CTA)}</a>
    </p>
    <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">${esc(v.HOURS)} · ${esc(v.TTY)}. ${esc(v.RECORDING)}</p>
    <p style="margin:0;color:#6b7280;font-size:13px;">${esc(v.STOP_LINE)}</p>
  `;
  const text = [
    v.GREETING,
    "",
    `We have your ${v.KIND_LOWER}. ${v.RECEIVED_BODY}`,
    "",
    `${v.RECEIVED_SOONER} ${v.PHONE_DISPLAY} · ${v.HOURS} · ${v.TTY}`,
    "",
    v.STOP_LINE,
    v.HQ,
  ].join("\n");
  return {
    alias: "insureitall-lead-received",
    subject,
    preview,
    text,
    html: wrap(brand, { title: v.RECEIVED_TITLE, preview, inner }),
    variables: { ...v, SUBJECT: subject, PREVIEW: preview },
  };
}

export const RESEND_VARIABLES = {
  shared: [
    "SITE_NAME",
    "NPN",
    "HQ",
    "HOURS",
    "TTY",
    "PHONE_DISPLAY",
    "PHONE_HREF",
    "NON_AFFILIATION",
    "FOOTER_LICENSE",
  ],
  "insureitall-lead-alert": [
    "KIND",
    "FIRST_NAME",
    "PHONE",
    "EMAIL",
    "ZIP",
    "WINDOW",
    "ID",
    "CONSOLE_URL",
    "DESK_CTA",
    "ALERT_INTRO",
    "ALERT_CLOSE",
    "SUBJECT",
    "PREVIEW",
  ],
  "insureitall-lead-received": [
    "FIRST_NAME",
    "GREETING",
    "KIND",
    "KIND_LOWER",
    "RECEIVED_TITLE",
    "RECEIVED_BODY",
    "RECEIVED_SOONER",
    "CALL_CTA",
    "RECORDING",
    "STOP_LINE",
    "SUBJECT",
    "PREVIEW",
  ],
};

export const RESEND_DASHBOARD = {
  "insureitall-lead-alert": {
    name: "INSUREitALL · Lead alert (team)",
    from: "INSUREitALL Leads <alerts@insureitall-llc.com>",
    subject: "{{KIND}} · {{FIRST_NAME}} · {{ID}}",
    variables: [...RESEND_VARIABLES.shared, ...RESEND_VARIABLES["insureitall-lead-alert"]],
  },
  "insureitall-lead-received": {
    name: "INSUREitALL · We have your request",
    from: "INSUREitALL <info@team-iia.com>",
    subject: "{{RECEIVED_TITLE}} — {{SITE_NAME}}",
    variables: [...RESEND_VARIABLES.shared, ...RESEND_VARIABLES["insureitall-lead-received"]],
  },
};
