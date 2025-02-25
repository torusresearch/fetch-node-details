import { KEY_TYPE, SIG_TYPE, WEB3AUTH_KEY_TYPE, WEB3AUTH_SIG_TYPE } from "@toruslabs/constants";

export function validateKeyTypeAndSigTypeForTSS(keyType: WEB3AUTH_KEY_TYPE, sigType?: WEB3AUTH_SIG_TYPE) {
  if (sigType === SIG_TYPE.ECDSA_SECP256K1) {
    if (keyType !== KEY_TYPE.SECP256K1) {
      throw new Error("Invalid key type for ecdsa-secp256k1");
    }
  } else if (sigType === SIG_TYPE.BIP340) {
    if (keyType !== KEY_TYPE.SECP256K1) {
      throw new Error("Invalid key type for bip340");
    }
  } else if (sigType === SIG_TYPE.ED25519) {
    if (keyType !== KEY_TYPE.ED25519) {
      throw new Error("Invalid key type for ed25519");
    }
  }
}

export function validateSigTypeAndGetTSSPath(keyType: WEB3AUTH_KEY_TYPE, sigType?: WEB3AUTH_SIG_TYPE): "tss" | "tss-frost" {
  validateKeyTypeAndSigTypeForTSS(keyType, sigType);

  let tssPath: "tss" | "tss-frost";
  if (!sigType) {
    // if sigType is not provided, we will determine the tssPath based on the keyType
    if (keyType === KEY_TYPE.SECP256K1) {
      tssPath = "tss";
    } else if (keyType === KEY_TYPE.ED25519) {
      tssPath = "tss-frost";
    }
  } else if (sigType === SIG_TYPE.ECDSA_SECP256K1) {
    // we will use dkls for ECDSA Sigs
    tssPath = "tss";
  } else if (sigType === SIG_TYPE.ED25519 || sigType === SIG_TYPE.BIP340) {
    // we will use frost for Ed25519 and BIP340 Sigs
    tssPath = "tss-frost";
  } else {
    throw new Error(`Unsupported signature type: ${sigType} for key: ${keyType}`);
  }
  return tssPath;
}
