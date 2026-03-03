const fs = require('fs');

// Create directories if needed
const dirs = ['public/images/barbers', 'public/images/gallery', 'public/images/hero', 'public/images/about'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Create barber placeholders
const barbers = ['trill-l', 'charlo-f', 'daplug-jcox', 'tru-b', 'shay-25', 'rob-pro_edge_cutz', 'lee-thebarber', 'larro-cuts'];
barbers.forEach((barber, i) => {
  const filename = `public/images/barbers/${barber}.svg`;
  // Create a simple colored placeholder
  const color = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'][i % 8];
  const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="${color}"/><text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="24" fill="white">Barber ${i+1}</text></svg>`;
  fs.writeFileSync(filename, svg);
});

// Create gallery placeholders
for (let i = 1; i <= 6; i++) {
  const filename = `public/images/gallery/work-${i}.svg`;
  const color = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][i-1];
  const svg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="400" fill="${color}"/><text x="300" y="220" text-anchor="middle" font-family="Arial" font-size="24" fill="white">Work ${i}</text></svg>`;
  fs.writeFileSync(filename, svg);
}

// Create hero and about placeholders
const heroSvg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg"><rect width="1920" height="1080" fill="#2D3748"/><text x="960" y="540" text-anchor="middle" font-family="Arial" font-size="48" fill="white">Hero Background</text></svg>`;
fs.writeFileSync('public/images/hero/hero-bg.svg', heroSvg);

const aboutSvg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="#4A5568"/><text x="400" y="300" text-anchor="middle" font-family="Arial" font-size="24" fill="white">Shop Interior</text></svg>`;
fs.writeFileSync('public/images/about/shop-interior.svg', aboutSvg);

console.log('Placeholder images created');
