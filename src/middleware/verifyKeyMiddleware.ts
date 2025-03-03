import { verifyKey } from "discord-interactions";
import { Bindings } from "..";
import { createMiddleware } from "hono/factory";

export const verifyKeyMiddleware = createMiddleware<{ Bindings: Bindings }>(
  async (c, next) => {
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");
    const body = await c.req.text();

    const isValid =
      signature != null &&
      timestamp != null &&
      (await verifyKey(body, signature, timestamp, c.env.DISCORD_PUBLIC_KEY));

    if (!isValid) {
      console.warn("Invalid request signature");
      return c.text("Bad request signature", 401);
    }

    return next();
  }
);
