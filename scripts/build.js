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

// Obfuscate the build files
const obfuscateBuild = () => {
  const buildDir = path.join(__dirname, '../build');
  const files = fs.readdirSync(buildDir);
  
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(buildDir, file);
      const code = fs.readFileSync(filePath, 'utf8');
      const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
      fs.writeFileSync(filePath, obfuscatedCode.getObfuscatedCode());
    }
  });
};

obfuscateBuild();