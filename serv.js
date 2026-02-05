// Assumes BrowserFS is already configured and fs is available globally

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only intercept same-origin requests (ignore external URLs)
  if (url.origin !== location.origin) return;

  // Handle requests by reading from FS
  event.respondWith(
    new Promise((resolve) => {
      const filePath = url.pathname.startsWith('/') ? url.pathname : '/' + url.pathname;

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          resolve(new Response("File not found", { status: 404 }));
        } else {
          let contentType = 'text/plain';
          if (filePath.endsWith('.html')) contentType = 'text/html';
          else if (filePath.endsWith('.js')) contentType = 'text/javascript';
          else if (filePath.endsWith('.css')) contentType = 'text/css';

          resolve(new Response(data, {
            status: 200,
            headers: { 'Content-Type': contentType }
          }));
        }
      });
    })
  );
});
