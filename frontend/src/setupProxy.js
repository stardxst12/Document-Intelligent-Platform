const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Explicit proxy so POST /documents/ and /media/ always reach Django (port 8000).
 * The "proxy" field in package.json is unreliable for some API routes in react-scripts 5.
 */
module.exports = function setupProxy(app) {
  const target = process.env.REACT_APP_PROXY_TARGET || 'http://127.0.0.1:8000';
  app.use(
    ['/documents', '/media'],
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
    })
  );
};
