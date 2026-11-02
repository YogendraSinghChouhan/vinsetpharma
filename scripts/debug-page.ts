async function test() {
  const res = await fetch("http://localhost:3009/products/veltra-d-tablets");
  const html = await res.text();
  const stripped = html
    .replace(/placeholder="[^"]*"/gi, "")
    .replace(/data-placeholder="[^"]*"/gi, "")
    .replace(/__placeholder__/g, "");

  const matches = [...stripped.matchAll(/.{0,40}placeholder.{0,40}/gi)];
  for (const m of matches) {
    console.log("MATCH:", m[0]);
  }
}
test();
