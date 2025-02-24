import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import imageminWebp from 'imagemin-webp';
import imageminSvgo from 'imagemin-svgo';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/*',
          dest: 'assets',
        },
      ],
    }),
    viteImagemin({
      plugins: {
        jpg: imageminMozjpeg(),
        svg: imageminSvgo(),
        png: imageminPngquant(),
      },
      makeWebp: {
        plugins: {
          jpg: imageminWebp(),
          png: imageminWebp(),
          svg: imageminWebp(),
        },
      },
    }),
    react(),
    svgr(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
});
