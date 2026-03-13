import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8000;

const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';

    let filePath = path.join(__dirname, urlPath);
    let ext = path.extname(filePath).toLowerCase();

    const serveFile = (p, isRetry = false) => {
        const currentExt = path.extname(p).toLowerCase();
        const mime = MIME[currentExt] || 'application/octet-stream';

        fs.readFile(p, (err, data) => {
            if (err) {
                if (!isRetry && !currentExt) {
                    const htmlPath = p + '.html';
                    serveFile(htmlPath, true);
                    return;
                }
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': mime });
            res.end(data);
        });
    };

    serveFile(filePath);
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
