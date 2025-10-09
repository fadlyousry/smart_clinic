const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('src/pages/Reception');

files.forEach(file => {
    if (file.endsWith('.jsx') || file.endsWith('.js')) {
        let content = fs.readFileSync(file, 'utf8');
        
        let newContent = content
            .replace(/Nursing/g, 'Reception')
            .replace(/nursing/g, 'reception')
            .replace(/التمريض/g, 'الاستقبال')
            .replace(/ممرض/g, 'موظف استقبال');
            
        if (newContent !== content) {
            fs.writeFileSync(file, newContent);
            console.log(`Updated ${file}`);
        }
    }
});
