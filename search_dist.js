import fs from 'fs';

const path = '/home/viking/Proyectos/ReparoTuCompu/dist/assets/index-CSmU6uVs.js';
if (fs.existsSync(path)) {
  const content = fs.readFileSync(path, 'utf8');
  console.log("File size:", content.length);
  const idx = content.indexOf('AUTOMATICO');
  if (idx !== -1) {
    console.log("Found AUTOMATICO at index:", idx);
    console.log("Context:", content.substring(idx - 100, idx + 100));
  } else {
    console.log("AUTOMATICO not found");
  }
} else {
  console.log("File does not exist");
}
