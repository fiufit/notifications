import { CreateSubscriberSchema } from "@src/controllers/schemas";
import { z } from "zod";

const obj = {
  body: {
    user_id: "               234  ",
    device_id: "899"
  },
  params: {
    pepe: 'da'
  }
}

const a = z.string().trim();
const b = "  pepe  ";
const c = a.parse("              pepe  ");
const result2 = CreateSubscriberSchema.parse(obj);

test('dummie test', () => {
  const result = 0;
  console.log(result2);
  console.log(obj);
  console.log(c);
  console.log(b)
  expect(result).toBe(0);

});