import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/calendo-icon.svg');
const resDir = path.resolve('android/app/src/main/res');

const iconSizes = [
  { folder: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { folder: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { folder: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { folder: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { folder: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
];

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);

  for (const item of iconSizes) {
    const targetFolder = path.join(resDir, item.folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // 1. Standard Launcher Icon
    await sharp(svgBuffer)
      .resize(item.size, item.size)
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher.png'));

    // 2. Round Launcher Icon (with circular mask)
    const circleMask = Buffer.from(
      `<svg><circle cx="${item.size / 2}" cy="${item.size / 2}" r="${item.size / 2}" fill="black"/></svg>`
    );
    await sharp(svgBuffer)
      .resize(item.size, item.size)
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher_round.png'));

    // 3. Adaptive Foreground Icon (scaled in center with transparent padding)
    const iconPadded = Math.round(item.fgSize * 0.72);
    const innerIcon = await sharp(svgBuffer).resize(iconPadded, iconPadded).png().toBuffer();
    await sharp({
      create: {
        width: item.fgSize,
        height: item.fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: innerIcon, gravity: 'center' }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher_foreground.png'));

    console.log(`Generated icons for ${item.folder}`);
  }

  // 4. Splash Screens
  const splashDrawables = [
    { folder: 'drawable', width: 480, height: 800 },
    { folder: 'drawable-port-mdpi', width: 320, height: 480 },
    { folder: 'drawable-port-hdpi', width: 480, height: 800 },
    { folder: 'drawable-port-xhdpi', width: 720, height: 1280 },
    { folder: 'drawable-port-xxhdpi', width: 960, height: 1600 },
    { folder: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
  ];

  for (const s of splashDrawables) {
    const splashFolder = path.join(resDir, s.folder);
    if (!fs.existsSync(splashFolder)) {
      fs.mkdirSync(splashFolder, { recursive: true });
    }

    const iconSize = Math.round(Math.min(s.width, s.height) * 0.4);
    const centerIcon = await sharp(svgBuffer).resize(iconSize, iconSize).png().toBuffer();

    await sharp({
      create: {
        width: s.width,
        height: s.height,
        channels: 4,
        background: { r: 7, g: 8, b: 11, alpha: 1 }, // Dark obsidian Calendo background
      },
    })
      .composite([{ input: centerIcon, gravity: 'center' }])
      .png()
      .toFile(path.join(splashFolder, 'splash.png'));

    console.log(`Generated splash for ${s.folder}`);
  }

  console.log('All Android Launcher Icons & Splash Screens generated successfully!');
}

generateIcons().catch(console.error);
