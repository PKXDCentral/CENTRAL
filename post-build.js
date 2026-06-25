import fs from 'fs';
import path from 'path';

const distPath = path.join(process.cwd(), 'dist');
const sourceFile = path.join(distPath, 'inscricoes.html');

if (fs.existsSync(sourceFile)) {
  const content = fs.readFileSync(sourceFile);

  const targets = [
    path.join(distPath, 'inscricoes', 'index.html'),
    path.join(distPath, 'Inscricoes', 'index.html'),
    path.join(distPath, 'Inscrições', 'index.html'),
  ];

  targets.forEach((target) => {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(target, content);
    console.log(`Copied inscricoes.html to ${target}`);
  });
} else {
  console.warn('Warning: dist/inscricoes.html not found, skipping replication.');
}
