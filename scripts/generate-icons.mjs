// scripts/generate-icons.mjs
import sharp from 'sharp';

const input = 'assets/VS Code bilang superhero.png';

await sharp(input).resize(256, 256).png().toFile('assets/icon-256.png');
await sharp(input).resize(128, 128).png().toFile('assets/icon-128.png');
