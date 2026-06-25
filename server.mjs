import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { extname, normalize, resolve, sep } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

export function resolveRequestPath(pathname) {
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^[/\\]+/, "");
  const normalizedPath = normalize(relativePath);
  const filePath = resolve(root, normalizedPath);

  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    return null;
  }

  return filePath;
}

export function contentTypeFor(filePath) {
  return contentTypes[extname(filePath)] || "application/octet-stream";
}

function handleRequest(request, response) {
  const pathname = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname);
  const filePath = resolveRequestPath(pathname);

  if (!filePath || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypeFor(filePath),
  });
  createReadStream(filePath).pipe(response);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  createServer(handleRequest).listen(port, () => {
    console.log(`DynamicUI dashboard running at http://localhost:${port}`);
  });
}
