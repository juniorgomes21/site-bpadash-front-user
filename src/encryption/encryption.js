import CryptoJS from "crypto-js";

export function encrypt(code) {
    const key = "KD19SJW2mXwsdowda14";

    return CryptoJS.AES.encrypt(code, key.toString()).toString(CryptoJS.enc.Base64);
}

export function deCrypt(code) {
    const key = "KD19SJW2mXwsdowda14";

    const bytes = CryptoJS.AES.decrypt(code, key.toString());
    
    return bytes.toString(CryptoJS.enc.Utf8);
}