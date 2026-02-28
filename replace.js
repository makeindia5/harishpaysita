const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === '.expo') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            replaceInDir(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.json')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('freepe.in')) {
                content = content.replace(/indiaapay\.com/g, 'freepe.in');
                fs.writeFileSync(fullPath, content);
                console.log('Updated', fullPath);
            }
        }
    }
}

replaceInDir(__dirname);
