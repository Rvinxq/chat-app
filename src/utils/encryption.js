import CryptoJS from 'crypto-js';

export const generateKeyPair = () => {
  // Generate a random key pair for each user
  const privateKey = CryptoJS.lib.WordArray.random(256/8);
  const publicKey = CryptoJS.lib.WordArray.random(256/8);
  return { privateKey: privateKey.toString(), publicKey: publicKey.toString() };
};

export const encryptMessage = (message, recipientPublicKey) => {
  const encrypted = CryptoJS.AES.encrypt(message, recipientPublicKey).toString();
  return encrypted;
};

export const decryptMessage = (encryptedMessage, privateKey) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedMessage, privateKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
}; 