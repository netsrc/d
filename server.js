const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const ROOT_DIR = path.join(__dirname, 'files');

app.use(express.static(__dirname));

// Recursively walk a directory and list all files
function walkDir(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const relativePath = path.join(base, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath, relativePath));
    } else {
      results.push(relativePath);
    }
  });

  return results;
}

// Public API to list files — no auth
app.get('/list-files', (req, res) => {
  try {
    const files = walkDir(ROOT_DIR);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read files' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
