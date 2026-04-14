import { Hono } from "hono";
import { coupleInputSchema } from "@personaltax/shared-types";
import { calculateTax } from "@personaltax/tax-engine";

const calculate = new Hono();

calculate.post("/", async (c) => {
  const body = await c.req.json();

  const parsed = coupleInputSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      400
    );
  }

  const result = calculateTax(parsed.data);
  return c.json(result);
});

export { calculate };
