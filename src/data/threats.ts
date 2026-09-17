export type ThreatSeverity = "critical" | "high" | "moderate";

export interface Threat {
  id: string;
  date: string;
  title: string;
  /** npm package names this incident affected */
  packages: string[];
  severity: ThreatSeverity;
  vector: string;
  summary: string;
  reference?: string;
}

/** Real, documented open-source supply chain incidents, newest first. */
export const THREATS: Threat[] = [
  {
    id: "shai-hulud",
    date: "2025-09-16",
    title: "Shai-Hulud self-replicating npm worm",
    packages: ["@ctrl/tinycolor", "ngx-bootstrap", "ng2-file-upload"],
    severity: "critical",
    vector: "Stolen maintainer tokens + self-propagating postinstall",
    summary:
      "A worm published trojanised versions of hundreds of npm packages, harvested developer credentials with TruffleHog and used them to publish itself into every other package the victim maintained.",
    reference: "https://www.stepsecurity.io/blog/introducing-harden-npm",
  },
  {
    id: "chalk-debug-2025",
    date: "2025-09-08",
    title: "chalk / debug maintainer phishing",
    packages: ["chalk", "debug", "ansi-styles", "supports-color"],
    severity: "critical",
    vector: "Phished maintainer account, browser crypto-clipper payload",
    summary:
      "Eighteen extremely popular packages with billions of weekly downloads briefly shipped a payload that silently rewrote crypto wallet addresses in the browser.",
  },
  {
    id: "polyfill-io",
    date: "2024-06-25",
    title: "polyfill.io CDN takeover",
    packages: ["polyfill-service"],
    severity: "high",
    vector: "Domain ownership change, malicious script injection",
    summary:
      "After the polyfill.io domain changed hands, the CDN began serving malware to mobile visitors of more than 100,000 sites that embedded the script.",
  },
  {
    id: "xz-utils",
    date: "2024-03-29",
    title: "XZ Utils backdoor (CVE-2024-3094)",
    packages: ["xz", "liblzma"],
    severity: "critical",
    vector: "Multi-year social engineering of a lone maintainer",
    summary:
      "A trusted co-maintainer inserted an obfuscated backdoor into the xz release tarballs that hooked sshd authentication — caught by a performance anomaly days before wide distribution.",
  },
  {
    id: "node-ipc",
    date: "2022-03-15",
    title: "node-ipc protestware wiper",
    packages: ["node-ipc", "peacenotwar"],
    severity: "high",
    vector: "Maintainer-authored destructive payload",
    summary:
      "The maintainer shipped code that overwrote files on machines geolocated to certain countries, turning a transitive build dependency into a data-destruction tool.",
  },
  {
    id: "colors-faker",
    date: "2022-01-08",
    title: "colors.js and faker.js sabotage",
    packages: ["colors", "faker"],
    severity: "high",
    vector: "Maintainer-authored infinite loop",
    summary:
      "The author published versions that printed garbage in an endless loop, breaking thousands of CI pipelines and applications that depended on them only indirectly.",
  },
  {
    id: "ua-parser-js",
    date: "2021-10-22",
    title: "ua-parser-js account hijack",
    packages: ["ua-parser-js"],
    severity: "critical",
    vector: "Hijacked maintainer npm account",
    summary:
      "Three malicious versions shipped a cryptominer and a credential stealer to a package with tens of millions of weekly downloads.",
  },
  {
    id: "event-stream",
    date: "2018-11-20",
    title: "event-stream / flatmap-stream backdoor",
    packages: ["event-stream", "flatmap-stream"],
    severity: "critical",
    vector: "Ownership handover to a malicious volunteer",
    summary:
      "A new maintainer added an encrypted payload that targeted a specific Bitcoin wallet application — the canonical example of a deep transitive dependency being weaponised.",
  },
  {
    id: "eslint-scope",
    date: "2018-07-12",
    title: "eslint-scope credential theft",
    packages: ["eslint-scope", "eslint-config-eslint"],
    severity: "high",
    vector: "Reused maintainer password, no 2FA",
    summary:
      "A malicious release exfiltrated developers' npm tokens during install, which could have been used to poison further packages.",
  },
  {
    id: "left-pad",
    date: "2016-03-22",
    title: "left-pad unpublish outage",
    packages: ["left-pad"],
    severity: "moderate",
    vector: "Maintainer unpublished the package",
    summary:
      "An eleven-line utility disappeared from the registry and broke builds worldwide — availability, not malice, is also a supply chain risk.",
  },
];

export const SEVERITY_WEIGHT: Record<ThreatSeverity, number> = {
  critical: 1,
  high: 0.7,
  moderate: 0.4,
};
