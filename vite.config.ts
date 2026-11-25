
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  console.log('Mode:', mode);
  console.log('Storage API target:', env.STORAGE_API_TARGET);

  return {
    plugins: [vue()],

    server: {
      proxy: {
        '/storage-api': {
          target: env.STORAGE_API_TARGET,
          changeOrigin: true,

          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.error('Proxy error:', err);
            });

            proxy.on('proxyReq', (proxyReq, req) => {
              console.log(
                  'Proxy request:',
                  req.method,
                  req.url,
                  '->',
                  proxyReq.protocol,
                  proxyReq.getHeader('host')
              );
            });

            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(
                  'Proxy response:',
                  proxyRes.statusCode,
                  req.url
              );
            });
          }
        }
      }
    }
  };
});
