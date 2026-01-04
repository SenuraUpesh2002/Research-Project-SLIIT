const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

(async function main(){
  try {
    // backend/scripts -> go up two to workspace root, then model/visualizations
    const vizDir = path.join(__dirname, '..', '..', 'model', 'visualizations');
    if (!fs.existsSync(vizDir)) {
      console.error('Visualizations directory not found:', vizDir);
      process.exit(1);
    }

    const thumbDir = path.join(vizDir, 'thumbs');
    if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

    const files = fs.readdirSync(vizDir).filter(f => {
      const lower = f.toLowerCase();
      return lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp') || lower.endsWith('.gif') || lower.endsWith('.svg');
    });

    for (const file of files) {
      try {
        const src = path.join(vizDir, file);
        const dst = path.join(thumbDir, file);
        // Skip SVG (can't rasterize reliably with sharp without svg->png) — copy as-is
        if (file.toLowerCase().endsWith('.svg')) {
          fs.copyFileSync(src, dst);
          console.log('Copied SVG to thumbs:', file);
          continue;
        }

        // Generate thumbnail
        await sharp(src)
          .resize({ width: 480 })
          .toFile(dst + '.tmp');
        fs.renameSync(dst + '.tmp', dst);
        console.log('Generated thumbnail:', file);
      } catch (err) {
        console.error('Failed thumb for', file, err.message);
      }
    }

    console.log('Thumbnails generation completed. Thumbs in', thumbDir);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
