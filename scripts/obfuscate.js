const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const obfuscateCode = (code) => {
  return JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: true,
    simplify: true,
    stringArrayShuffle: true,
    splitStrings: true,
    stringArrayThreshold: 1,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    debugProtection: false,
    debugProtectionInterval: false,
    disableConsoleOutput: true,
    rotateStringArray: true,
    selfDefending: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
  }).getObfuscatedCode();
};

const obfuscateBuild = () => {
  const buildPath = path.join(__dirname, '../build/static/js');
  const files = fs.readdirSync(buildPath);

  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(buildPath, file);
      const code = fs.readFileSync(filePath, 'utf8');
      const obfuscated = obfuscateCode(code);
      fs.writeFileSync(filePath, obfuscated);
    }
  });
};

obfuscateBuild(); 