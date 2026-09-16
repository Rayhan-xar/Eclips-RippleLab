export type NodeType = "application" | "library" | "foundational";

export interface EcoNode {
  id: string;
  name: string;
  version: string;
  type: NodeType;
}

export interface EcoEdge {
  /** dependent */
  source: string;
  /** dependency */
  target: string;
}

export const NODES: EcoNode[] = [
  { id: "app-auth", name: "auth-service", version: "2.1.0", type: "application" },
  { id: "app-payment", name: "payment-gateway", version: "3.0.1", type: "application" },
  { id: "app-dashboard", name: "user-dashboard", version: "1.8.0", type: "application" },
  { id: "app-api", name: "api-gateway", version: "4.2.0", type: "application" },
  { id: "app-notify", name: "notification-service", version: "1.3.0", type: "application" },
  { id: "app-analytics", name: "analytics-engine", version: "2.0.0", type: "application" },

  { id: "lib-express", name: "express", version: "4.18.2", type: "library" },
  { id: "lib-axios", name: "axios", version: "1.6.0", type: "library" },
  { id: "lib-jsonwebtoken", name: "jsonwebtoken", version: "9.0.0", type: "library" },
  { id: "lib-mongoose", name: "mongoose", version: "7.5.0", type: "library" },
  { id: "lib-bcrypt", name: "bcrypt", version: "5.1.0", type: "library" },
  { id: "lib-cors", name: "cors", version: "2.8.5", type: "library" },
  { id: "lib-helmet", name: "helmet", version: "7.0.0", type: "library" },
  { id: "lib-winston", name: "winston", version: "3.10.0", type: "library" },
  { id: "lib-joi", name: "joi", version: "17.9.0", type: "library" },
  { id: "lib-redis", name: "ioredis", version: "5.3.0", type: "library" },
  { id: "lib-socket", name: "socket.io", version: "4.7.0", type: "library" },
  { id: "lib-bull", name: "bull", version: "4.11.0", type: "library" },
  { id: "lib-nodemailer", name: "nodemailer", version: "6.9.0", type: "library" },
  { id: "lib-stripe", name: "stripe", version: "13.0.0", type: "library" },

  { id: "found-lodash", name: "lodash", version: "4.17.21", type: "foundational" },
  { id: "found-debug", name: "debug", version: "4.3.4", type: "foundational" },
  { id: "found-ms", name: "ms", version: "2.1.3", type: "foundational" },
  { id: "found-semver", name: "semver", version: "7.5.4", type: "foundational" },
  { id: "found-colors", name: "colors", version: "1.4.0", type: "foundational" },
  { id: "found-minimist", name: "minimist", version: "1.2.8", type: "foundational" },
  { id: "found-qs", name: "qs", version: "6.11.0", type: "foundational" },
  { id: "found-safer-buffer", name: "safer-buffer", version: "2.1.2", type: "foundational" },
  { id: "found-inherits", name: "inherits", version: "2.0.4", type: "foundational" },
  { id: "found-depd", name: "depd", version: "2.0.0", type: "foundational" },
];

const DEPENDENCIES: Record<string, string[]> = {
  "app-auth": [
    "lib-express",
    "lib-jsonwebtoken",
    "lib-bcrypt",
    "lib-mongoose",
    "lib-helmet",
    "lib-cors",
    "lib-winston",
  ],
  "app-payment": [
    "lib-express",
    "lib-stripe",
    "lib-mongoose",
    "lib-helmet",
    "lib-joi",
    "lib-winston",
  ],
  "app-dashboard": [
    "lib-express",
    "lib-axios",
    "lib-redis",
    "lib-socket",
    "lib-cors",
    "lib-winston",
  ],
  "app-api": ["lib-express", "lib-helmet", "lib-cors", "lib-joi", "lib-winston", "lib-axios"],
  "app-notify": ["lib-express", "lib-bull", "lib-nodemailer", "lib-redis", "lib-winston"],
  "app-analytics": ["lib-express", "lib-mongoose", "lib-redis", "lib-axios", "lib-winston"],

  "lib-express": ["found-debug", "found-qs", "found-depd", "found-safer-buffer"],
  "lib-axios": ["found-lodash", "found-debug"],
  "lib-jsonwebtoken": ["found-lodash", "found-ms", "found-semver"],
  "lib-mongoose": ["found-lodash", "found-debug", "found-ms", "found-semver"],
  "lib-bcrypt": ["found-inherits"],
  "lib-helmet": ["found-depd"],
  "lib-winston": ["found-colors", "found-debug", "found-inherits"],
  "lib-joi": ["found-lodash", "found-semver"],
  "lib-redis": ["found-lodash", "found-debug", "found-ms"],
  "lib-socket": ["found-debug", "found-ms"],
  "lib-bull": ["found-lodash", "found-debug", "found-semver", "found-ms"],
  "lib-nodemailer": ["found-lodash"],
  "lib-stripe": ["found-lodash", "found-qs"],
  "lib-cors": ["found-lodash"],
};

export const EDGES: EcoEdge[] = Object.entries(DEPENDENCIES).flatMap(([source, targets]) =>
  targets.map((target) => ({ source, target })),
);

export const NODE_BY_ID: Record<string, EcoNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
);

export const APPLICATIONS = NODES.filter((n) => n.type === "application");

/** Known safe alternatives used by the Compare view. */
export const ALTERNATIVES: Record<string, string> = {
  "found-lodash": "es-toolkit",
  "found-debug": "pino-debug",
  "found-ms": "pretty-ms",
  "found-colors": "picocolors",
  "found-qs": "URLSearchParams (native)",
  "found-semver": "@std/semver",
  "found-minimist": "citty",
  "found-inherits": "class extends (native)",
  "found-depd": "node:util.deprecate",
  "found-safer-buffer": "Buffer (native)",
  "lib-express": "fastify",
  "lib-axios": "ofetch",
  "lib-jsonwebtoken": "jose",
  "lib-mongoose": "prisma",
  "lib-bcrypt": "argon2",
  "lib-cors": "@fastify/cors",
  "lib-helmet": "@fastify/helmet",
  "lib-winston": "pino",
  "lib-joi": "zod",
  "lib-redis": "node-redis",
  "lib-socket": "ws",
  "lib-bull": "bullmq",
  "lib-nodemailer": "resend",
  "lib-stripe": "stripe-node (pinned fork)",
};

export function alternativeFor(id: string): string {
  return ALTERNATIVES[id] ?? "a vetted, audited fork";
}
