import { Hono } from "hono";
import { verifyKeyMiddleware } from "./middleware/verifyKeyMiddleware";
import {
  APIInteraction,
  InteractionType,
  InteractionResponseType,
  APIInteractionResponsePong,
} from "discord-api-types/v10";

export type Bindings = {
  DISCORD_TOKEN: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
};

const app = new Hono();

app.use("/interactions", verifyKeyMiddleware);

app.get("/", (c) => {
  return c.text("ping-worker is up");
});

app.post("/interactions", async (c) => {
  const interaction = await c.req.json<APIInteraction>();

  console.log(interaction);
  if (interaction.type == InteractionType.Ping) {
    return c.json<APIInteractionResponsePong>({
      type: InteractionResponseType.Pong,
    });
  }
});

export default app;
