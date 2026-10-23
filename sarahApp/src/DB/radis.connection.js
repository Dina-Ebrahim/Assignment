import { createClient } from "redis";
import { RADIS_URI } from "../config.js";

export const client = createClient({
  url: RADIS_URI,
});

export async function connection() {
  try {
    await client.connect();
    console.log(`radis connected 💖`);
  } catch (error) {
    console.log(`fail connected 💖`);
  }
}
