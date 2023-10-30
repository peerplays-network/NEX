import * as bitcoin from "bitcoinjs-lib";
import counterpart from "counterpart";
import * as ethers from "ethers";
import { ClipboardEvent, KeyboardEvent } from "react";

import { Sidechain } from "../../common/types";
import {
  ASSETS_BLOCKCHAINS,
  BITCOIN_NETWORK,
  DEFAULT_NETWORK,
  ETHEREUM_NETWORK,
  HIVE_NETWORK,
  testnetCheck,
} from "../params";

const id_regex = /\b\d+\.\d+\.(\d+)\b/;
const NETWORK = testnetCheck ? bitcoin.networks.regtest : undefined;

export const utils = {
  sortID(a: string, b: string, inverse = false): number {
    // inverse = false => low to high
    const intA = parseInt(a.split(".")[2], 10);
    const intB = parseInt(b.split(".")[2], 10);

    return inverse ? intB - intA : intA - intB;
  },
  isObjectId: (obj_id: string): boolean => {
    if ("string" != typeof obj_id) return false;
    const match = id_regex.exec(obj_id);
    return match !== null && obj_id.split(".").length === 3;
  },
  trimNum: (num: number, digits: number): number => {
    // Early return if NaN
    if (isNaN(num)) {
      return 0;
    }
    const numString = num.toString();
    const decimalIndex = numString.indexOf(".");
    const subString =
      decimalIndex > 0
        ? numString.substring(0, decimalIndex + (digits + 1))
        : num;
    return parseFloat(subString as string);
  },
  isNumber: (input: string): boolean => {
    const numbers = "0123456789.";
    if (numbers.includes(input)) {
      return true;
    }
    return false;
  },
  isNumberKey: (e: KeyboardEvent<HTMLInputElement>): boolean => {
    return utils.isNumber(e.key);
  },
  ensureInputNumberValidity: (e: KeyboardEvent<HTMLInputElement>): void => {
    if (
      !utils.isNumberKey(e) ||
      (e.target as any).value.split(".")[0].length >= 6
    ) {
      e.preventDefault();
    }
  },
  numberedInputsPasteHandler: (e: ClipboardEvent<HTMLInputElement>): void => {
    const clipBoardData = e.clipboardData.getData("text");
    const isNumber = Array.from(clipBoardData)
      .map((char: string) => utils.isNumber(char))
      .every((_isNumber) => _isNumber);

    if (
      !isNumber ||
      ((e.target as any).value as string).length + clipBoardData.length >= 6
    ) {
      e.preventDefault();
    }
  },
  getNativeBlockchainFromAssetSymbol: (symbol: string): string => {
    const blockchains: Record<string, string> = {
      BTC: BITCOIN_NETWORK,
      PBTC: DEFAULT_NETWORK,
      HIVE: HIVE_NETWORK,
      HBD: HIVE_NETWORK,
      PEOS: "EOSIO",
      EOS: "EOSIO",
      PETH: ETHEREUM_NETWORK,
      ETH: ETHEREUM_NETWORK,
      TEST: DEFAULT_NETWORK,
      PPY: DEFAULT_NETWORK,
    };
    return blockchains[symbol.toUpperCase()] || symbol;
  },
  validatePeerplaysAccountName: (
    name: string
  ): { isValid: boolean; error?: string } => {
    let suffix = "";

    suffix = counterpart.translate(
      "field.errors.account_creation_errors.account_should"
    );

    const length = name.length;
    if (!/^[~a-z]/.test(name)) {
      return {
        isValid: false,
        error:
          suffix +
          counterpart.translate(
            "field.errors.account_creation_errors.start_with_letter"
          ),
      };
    }
    if (length < 2) {
      return {
        isValid: false,
        error:
          suffix +
          counterpart.translate(
            "field.errors.account_creation_errors.be_longer"
          ),
      };
    }
    if (length > 62) {
      return {
        isValid: false,
        error:
          suffix +
          counterpart.translate(
            "field.errors.account_creation_errors.be_shorter"
          ),
      };
    }
    if (/\./.test(name)) {
      suffix = counterpart.translate(
        "field.errors.account_creation_errors.account_segment_should"
      );
    }
    const ref = name.split(".");

    for (let i = 0, len = ref.length; i < len; i++) {
      const label = ref[i];
      if (!/^[~a-z]/.test(label)) {
        return {
          isValid: false,
          error:
            suffix +
            counterpart.translate(
              "field.errors.account_creation_errors.start_with_letter"
            ),
        };
      }
      if (!/^[~a-z0-9-]*$/.test(label)) {
        return {
          isValid: false,
          error:
            suffix +
            counterpart.translate(
              "field.errors.account_creation_errors.have_letters_digits_dashes"
            ),
        };
      }
      if (/--/.test(label)) {
        return {
          isValid: false,
          error:
            suffix +
            counterpart.translate(
              "field.errors.account_creation_errors.have_one_dash_in_row"
            ),
        };
      }
      if (!/[a-z0-9]$/.test(label)) {
        return {
          isValid: false,
          error:
            suffix +
            counterpart.translate(
              "field.errors.account_creation_errors.end_letter_digit"
            ),
        };
      }
      if (label.length < 2) {
        return {
          isValid: false,
          error:
            suffix +
            counterpart.translate(
              "field.errors.account_creation_errors.be_longer"
            ),
        };
      }
    }

    return { isValid: true };
  },
  validateHiveAccount: (name: string): { isValid: boolean; error?: string } => {
    let suffix = "";

    suffix = counterpart.translate(
      "field.errors.hive_account_errors.account_should"
    );

    const length = name.length;

    if (length < 3) {
      return {
        isValid: false,
        error:
          suffix +
          counterpart.translate("field.errors.hive_account_errors.be_longer"),
      };
    }
    if (length > 16) {
      return {
        isValid: false,
        error:
          suffix +
          counterpart.translate("field.errors.hive_account_errors.be_shorter"),
      };
    }
    if (!/^[~a-z]/.test(name)) {
      return {
        isValid: false,
        error:
          suffix +
          counterpart.translate(
            "field.errors.hive_account_errors.start_with_letter"
          ),
      };
    }
    if (!/^[~a-z0-9-]*$/.test(name)) {
      return {
        isValid: false,
        error:
          suffix +
          counterpart.translate(
            "field.errors.hive_account_errors.have_letters_digits_dashes"
          ),
      };
    }
    if (!/[a-z0-9]$/.test(name)) {
      return {
        isValid: false,
        error:
          suffix +
          counterpart.translate(
            "field.errors.hive_account_errors.end_letter_digit"
          ),
      };
    }
    if (/--/.test(name)) {
      return {
        isValid: false,
        error:
          suffix +
          counterpart.translate(
            "field.errors.hive_account_errors.have_one_dash_in_row"
          ),
      };
    }
    return { isValid: true };
  },
  isUrlsEqual: (url1: string, url2: string): boolean => {
    let trimedUrl1 =
      url1[url1.length - 1] !== "/" ? url1 : url1.slice(0, url1.length - 1);
    trimedUrl1 = trimedUrl1.includes("//")
      ? trimedUrl1.split("//")[1]
      : trimedUrl1;

    let trimedUrl2 =
      url2[url2.length - 1] !== "/" ? url2 : url2.slice(0, url2.length - 1);
    trimedUrl2 = trimedUrl2.includes("//")
      ? trimedUrl2.split("//")[1]
      : trimedUrl2;

    return trimedUrl1 === trimedUrl2;
  },
  getSidechainFromAssetSymbol: (symbol: string): Sidechain => {
    const blockchains: Record<string, Sidechain> = {
      BTC: Sidechain.BITCOIN,
      HIVE: Sidechain.HIVE,
      HBD: Sidechain.HIVE,
      ETH: Sidechain.ETHEREUM,
    };
    return blockchains[symbol.toUpperCase()];
  },
  getAssetBlockchains: (symbol: string): string[] => {
    return ASSETS_BLOCKCHAINS[symbol]
      ? ASSETS_BLOCKCHAINS[symbol]
      : [DEFAULT_NETWORK];
  },
  validateBitcoinCompressedPublicKey: (
    publicKey: string
  ): string | undefined => {
    if (
      publicKey.length !== 66 ||
      (publicKey.slice(0, 2) !== "03" && publicKey.slice(0, 2) !== "02")
    ) {
      return counterpart.translate(`field.errors.invalid_bitcoin_public_key`, {
        network: testnetCheck ? "regtest" : "mainnet",
      });
    }
  },
  validateBitcoinAddress: (
    address: string,
    publicKey: string
  ): string | undefined => {
    const pubkey = Buffer.from(publicKey, "hex");
    try {
      const { address: createdAddress } = bitcoin.payments.p2pkh({
        pubkey,
        network: NETWORK,
      });
      if (address !== createdAddress) {
        return counterpart.translate(`field.errors.not_match_address`);
      }
    } catch (e) {
      console.log(e);
      return counterpart.translate(`field.errors.first_valid_public_key`);
    }
  },
  validateEthereumAddress: (address: string): string | undefined => {
    const isAddress = ethers.isAddress(address);
    if (!isAddress) {
      return counterpart.translate("field.errors.invalid_ethereum_address");
    }
  },
};
