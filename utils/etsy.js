import crypto from 'crypto'

export function generateCodes () {
    const base64URLEncode = (str) => str.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest();

    const codeVerifier = base64URLEncode(crypto.randomBytes(32));

    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    const state = Math.random().toString(36).substring(7);

    return {
        state, codeChallenge, codeVerifier
    }
}