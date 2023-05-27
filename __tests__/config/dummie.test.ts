import { CreateSubscriberSchema } from "@src/controllers/schemas";
import { z, ZodError } from "zod";

const obj = {
  body: {
    user_id: "               234  ",
    device_token: "899"
  },
  params: {
    pepe: 'da'
  }
}

const a = z.string().trim();
const b = "  pepe  ";
const c = a.parse("              pepe  ");

test('dummie test', () => {
  const result = 0;
  
  console.log(obj);
  console.log(c);
  console.log(b)
  expect(result).toBe(0);
  expect(() => CreateSubscriberSchema.parse(obj)).toThrow(ZodError);
});