import { validateEnquiry } from "../src/lib/validation.ts";
const T = ["membership","facilities","visit","other"];
const base = { name:"Asha", phone:"", email:"", type:"membership", message:"" };
const cases = [
  ["valid: name + 10-digit phone",            {...base, phone:"98765 43210"}, []],
  ["valid: name + +91 phone with spaces",     {...base, phone:"+91 98765 43210"}, []],
  ["valid: name + email only",                {...base, email:"asha@example.com"}, []],
  ["valid: both phone and email",             {...base, phone:"9876543210", email:"a@b.co"}, []],
  ["valid: message optional/blank",           {...base, phone:"9876543210", message:""}, []],
  ["invalid: all empty",                      {name:"",phone:"",email:"",type:"",message:""}, ["name","contact","type"]],
  ["invalid: name only whitespace",           {...base, name:"   ", phone:"9876543210"}, ["name"]],
  ["invalid: 1-char name",                    {...base, name:"A", phone:"9876543210"}, ["name"]],
  ["invalid: neither phone nor email",        {...base}, ["contact"]],
  ["invalid: phone too short (9 digits)",     {...base, phone:"987654321"}, ["phone"]],
  ["invalid: phone too long (14 digits)",     {...base, phone:"98765432109876"}, ["phone"]],
  ["invalid: phone with letters",             {...base, phone:"98765abc10"}, ["phone"]],
  ["invalid: email missing @",                {...base, email:"asha.example.com"}, ["email"]],
  ["invalid: email missing domain dot",       {...base, email:"asha@example"}, ["email"]],
  ["invalid: bad email but valid phone",      {...base, phone:"9876543210", email:"nope"}, ["email"]],
  ["invalid: unknown enquiry type",           {...base, phone:"9876543210", type:"personal-training"}, ["type"]],
  ["invalid: empty enquiry type",             {...base, phone:"9876543210", type:""}, ["type"]],
];
let fail = 0;
for (const [label, v, expectKeys] of cases) {
  const got = Object.keys(validateEnquiry(v, T)).sort();
  const ok = JSON.stringify(got) === JSON.stringify([...expectKeys].sort());
  if (!ok) fail++;
  console.log((ok ? "PASS " : "FAIL ") + label + (ok ? "" : `  expected [${expectKeys}] got [${got}]`));
}
console.log(`\n${cases.length - fail}/${cases.length} validation cases passed`);
process.exit(fail ? 1 : 0);
