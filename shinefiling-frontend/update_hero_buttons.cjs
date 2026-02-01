const fs = require('fs');
const path = require('path');

const rootDir = "c:\\Users\\praka\\OneDrive\\Documents\\Desktop\\my_product\\shinefiling-frontend\\src\\pages\\services";

function walkSync(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        } else {
            if (file.endsWith('.jsx')) {
                filelist.push(path.join(dir, file));
            }
        }
    });
    return filelist;
}

const files = walkSync(rootDir);
let changedCount = 0;

files.forEach(filepath => {
    let content = fs.readFileSync(filepath, 'utf8');

    // Regex to match the hero button. 
    // We look for the onClick handler followed by the specific className used in Hero section.
    // Note: We need to be careful about whitespace.

    const regex = /(<button\s+)onClick=\{\(\)\s*=>\s*handlePlanSelect\('[^']+'\)\}(\s+className="px-8 py-4 bg-gradient-to-r)/g;

    if (regex.test(content)) {
        const newContent = content.replace(regex, `$1onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}$2`);

        // Also need to check if pricing-section id exists, if not warn? 
        // But for now we assume the template is consistent.

        if (newContent !== content) {
            fs.writeFileSync(filepath, newContent, 'utf8');
            console.log(`Updated: ${filepath}`);
            changedCount++;
        }
    }
});

console.log(`Total files updated: ${changedCount}`);
