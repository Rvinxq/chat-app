const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: true,
  shuffleStringArray: true,
  splitStrings: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 1,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

const obfuscateBuild = () => {
  const buildDir = path.join(__dirname, '../build');
  const jsDir = path.join(buildDir, 'static/js');

  // Read all files in the js directory
  fs.readdirSync(jsDir).forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(jsDir, file);
      console.log(`Obfuscating: ${file}`);
      
      const code = fs.readFileSync(filePath, 'utf8');
      const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
      
      // Write the obfuscated code back
      fs.writeFileSync(filePath, obfuscatedCode.getObfuscatedCode());
      
      // Remove source maps
      const mapFile = `${filePath}.map`;
      if (fs.existsSync(mapFile)) {
        fs.unlinkSync(mapFile);
      }
    }
  });

  // Remove source map references from js files
  fs.readdirSync(jsDir).forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(jsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/\/\/# sourceMappingURL=.*$/gm, '');
      fs.writeFileSync(filePath, content);
    }
  });
};

obfuscateBuild();