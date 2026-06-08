export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const upstream = await fetch("https://aviationweather.gov/api/data/windtemp");
    if (!upstream.ok) { res.status(502).end(); return; }
    const text = await upstream.text();
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "public, max-age=300"); // cache 5 min
    res.status(200).send(text);
  } catch {
    res.status(502).end();
  }
}
