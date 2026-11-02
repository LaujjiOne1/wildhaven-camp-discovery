import { test, expect } from "bun:test";

// Uses only the public app connection; never a privileged key.
const base = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const headers = () => {
  if (!base || !key) throw new Error("The public app connection is required");
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
};
test("signed-out visitors cannot read personal profiles", async () => {
  const result = await fetch(`${base}/rest/v1/profiles?select=id,display_name`, { headers: headers() });
  if (result.status === 200) expect(await result.json()).toEqual([]);
  else expect(result.status).toBe(401);
});
test("signed-out visitors cannot write personal profiles", async () => {
  const result = await fetch(`${base}/rest/v1/profiles`, {
    method: "POST", headers: headers(), body: JSON.stringify({ id: "00000000-0000-0000-0000-000000000001", display_name: "Unauthorized test" }),
  });
  expect(result.status).toBe(401);
});