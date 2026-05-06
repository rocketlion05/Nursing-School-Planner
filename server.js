const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 4173;
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

http
  .createServer((req, res) => {
    const cleanPath = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "");
    const target = cleanPath ? cleanPath : "index.html";
    const file = path.resolve(root, target);
    const relative = path.relative(root, file);

    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.readFile(file, (error, body) => {
      if (error) {
        send(res, 404, "Not found");
        return;
      }
      send(res, 200, body, types[path.extname(file)] || "application/octet-stream");
    });
  })
  .listen(port, () => {
    console.log(`Nursing School Planner running at http://localhost:${port}`);
  });
