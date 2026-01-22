import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Jimp = require('jimp');

const ImagemService = {
  async saveImage(baseDir, payload) {
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

    let buffer;
    let originalName = 'imagem';
    if (typeof payload === 'string') {
      originalName = path.basename(payload);
      buffer = fs.readFileSync(payload);
    } else if (payload && payload.name && Array.isArray(payload.data)) {
      originalName = payload.name;
      buffer = Buffer.from(payload.data);
    } else {
      throw new Error('Payload inválido para saveImage');
    }

    const ext = path.extname(originalName) || '.png';
    const baseName = `${Date.now()}-${path.basename(originalName, ext)}`;
    const fullPath = path.join(baseDir, `${baseName}${ext}`);
    const thumbPath = path.join(baseDir, `${baseName}-thumb${ext}`);

    const image = await Jimp.read(buffer);
    if (image.getWidth() > 1024) image.resize(1024, Jimp.AUTO);
    await image.quality(80).writeAsync(fullPath);

    const thumb = image.clone();
    thumb.cover(200, 200).quality(70);
    await thumb.writeAsync(thumbPath);

    return { fullPath, thumbPath };
  },

  deleteImage(imagePath) {
    try {
      if (!imagePath) return false;
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      const dir = path.dirname(imagePath);
      const ext = path.extname(imagePath);
      const base = path.basename(imagePath, ext);
      const thumb = path.join(dir, `${base}-thumb${ext}`);
      if (fs.existsSync(thumb)) fs.unlinkSync(thumb);
      return true;
    } catch (err) {
      console.error('Erro deleteImage:', err);
      return false;
    }
  }
};

export default ImagemService;
