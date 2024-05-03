/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import NodeRSA from 'node-rsa';
import { Platform } from 'react-native';
import * as SecureStore from 'react-native-encrypted-storage';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import config from '../bitcoin/HexaConfig';

export const store = async (hash, enc_key) => {
  try {
    if (Platform.OS === 'android') {
      if (await RNSecureStorage.exists(config.ENC_KEY_STORAGE_IDENTIFIER)) {
        await RNSecureStorage.remove(config.ENC_KEY_STORAGE_IDENTIFIER);
      }

      await RNSecureStorage.set(
        config.ENC_KEY_STORAGE_IDENTIFIER,
        JSON.stringify({
          hash,
          enc_key,
        }),
        {
          accessible: ACCESSIBLE.WHEN_UNLOCKED,
        }
      );
    } else {
      await SecureStore.default.setItem(
        config.ENC_KEY_STORAGE_IDENTIFIER,
        JSON.stringify({
          hash,
          enc_key,
        })
      );
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};

export const fetch = async (hash_current) => {
  try {
    let hash: any, enc_key: any, value: any;

    if (Platform.OS === 'android') {
      if (await RNSecureStorage.exists(config.ENC_KEY_STORAGE_IDENTIFIER)) {
        value = await RNSecureStorage.get(config.ENC_KEY_STORAGE_IDENTIFIER);
      }
    } else {
      value = await SecureStore.default.getItem(config.ENC_KEY_STORAGE_IDENTIFIER);
    }
    if (value) {
      ({ hash, enc_key } = JSON.parse(value));

      if (hash_current !== hash) {
        throw new Error('Incorrect passcode');
      } else return enc_key;
    } else {
      throw new Error('Identifier missing');
    }
  } catch (err) {
    console.log('Fetch err:', err);
    throw err;
  }
};

export const remove = async (key) => {
  try {
    if (Platform.OS === 'android') {
      if (await RNSecureStorage.exists(key)) {
        await RNSecureStorage.remove(key);
      }
    } else {
      await SecureStore.default.removeItem(key);
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};

// Biometrics
export const storeBiometricPubKey = async (pubKey: string) => {
  try {
    let pass: any, value: any;
    if (Platform.OS === 'android') {
      // if ( await RNSecureStorage.exists( config.ENC_KEY_STORAGE_IDENTIFIER ) ) {
      //   await RNSecureStorage.remove( config.ENC_KEY_STORAGE_IDENTIFIER )
      // }

      if (await RNSecureStorage.exists(config.ENC_KEY_STORAGE_IDENTIFIER)) {
        value = await RNSecureStorage.get(config.ENC_KEY_STORAGE_IDENTIFIER);
      }
      const { hash, enc_key } = JSON.parse(value);
      pass = {
        hash,
        enc_key,
        pubKey,
      };
      await RNSecureStorage.set(config.ENC_KEY_STORAGE_IDENTIFIER, JSON.stringify(pass), {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
    } else {
      value = await SecureStore.default.getItem(config.ENC_KEY_STORAGE_IDENTIFIER);
      const { hash, enc_key } = JSON.parse(value);
      pass = {
        hash,
        enc_key,
        pubKey,
      };
      await SecureStore.default.setItem(config.ENC_KEY_STORAGE_IDENTIFIER, JSON.stringify(pass));
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
export const verifyBiometricAuth = async (signature: string, payload: string) => {
  try {
    let value: any;
    if (Platform.OS === 'android') {
      if (await RNSecureStorage.exists(config.ENC_KEY_STORAGE_IDENTIFIER)) {
        value = await RNSecureStorage.get(config.ENC_KEY_STORAGE_IDENTIFIER);
      }
    } else {
      value = await SecureStore.default.getItem(config.ENC_KEY_STORAGE_IDENTIFIER);
    }
    const { pubKey, hash, enc_key } = JSON.parse(value);
    const publicKeyBuffer = Buffer.from(pubKey, 'base64');
    const key = new NodeRSA();
    const signer = key.importKey(publicKeyBuffer, 'public-der');
    const isVerified = signer.verify(Buffer.from(payload), signature, 'utf8', 'base64');
    if (isVerified) {
      return {
        success: true,
        encryptedKey: enc_key,
        hash: hash,
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
};
