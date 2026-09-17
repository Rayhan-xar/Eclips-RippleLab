import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(160),
  organisation: z.string().max(120).optional(),
  message: z.string().min(10).max(4000),
});

export const TEAM_INBOX = "team.eclipse.ripplelab@gmail.com";

export interface ContactResult {
  delivered: boolean;
  reason?: string;
}

/**
 * Sends a hackathon enquiry to Team ECLIPSE.
 * Delivery runs through the project's email sender once an email domain is connected;
 * until then the caller falls back to opening the visitor's own mail client.
 */
export const sendTeamMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<ContactResult> => {
    console.info("[contact] enquiry received", {
      name: data.name,
      email: data.email,
      organisation: data.organisation ?? "",
      length: data.message.length,
    });

    return {
      delivered: false,
      reason: "email_not_configured",
    };
  });
