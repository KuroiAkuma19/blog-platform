const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('.git') && !dirFile.includes('dist')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.match(/\.(js|jsx|css)$/)) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync('/Users/arnold/Projects/src');
files.push('/Users/arnold/Projects/vite.config.js');

let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  try {
      if (file.endsWith('.css')) {
         content = content.replace(/\/\*[\s\S]*?\*\//g, '');
      } else {
         // Remove JSX comments first so they don't become empty {}
         content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
         // Remove standard JS comments
         content = strip(content);
      }
      
      // Clean up multiple empty lines
      content = content.replace(/^\s*[\r\n]/gm, '\n');
      content = content.replace(/\n{3,}/g, '\n\n');
      
      if (content !== original) {
         fs.writeFileSync(file, content, 'utf8');
         console.log('Stripped comments from ' + file);
         count++;
      }
  } catch(e) {
      console.log('Error processing ' + file + ': ' + e.message);
  }
}
console.log(`Removed comments from ${count} files.`);
