import CryptoJS from "crypto-js";
import { getClientEncryptKey } from "./getClientEncryptKey";

const encryptPayload = (message: string) => {
  let iv = CryptoJS.lib.WordArray.random(16),
    key = CryptoJS.enc.Base64.parse(getClientEncryptKey());

  let options = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };

  let encrypted = CryptoJS.AES.encrypt(message, key, options);
  encrypted = encrypted.toString();
  iv = CryptoJS.enc.Base64.stringify(iv);

  let result_encrypt = {
    iv: iv,
    value: encrypted,
    mac: CryptoJS.HmacSHA256(iv + encrypted, key).toString(),
  };

  let result = JSON.stringify(result_encrypt);
  result = CryptoJS.enc.Utf8.parse(result);

  return CryptoJS.enc.Base64.stringify(result);
};

export default encryptPayload;
