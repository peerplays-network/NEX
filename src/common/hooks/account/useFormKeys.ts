import { Login, PrivateKey } from "peerplaysjs-lib";
import { useCallback } from "react";

import { defaultToken } from "../../../api/params";
import { AccountAuthorities, KeyType } from "../../types";

type UseFormKeysResult = {
  formKeys: (name: string, password: string) => AccountAuthorities;
  formWifKeys: (name: string, password: string) => AccountAuthorities;
  formWifKey: (
    username: string,
    password: string,
    role?: KeyType | undefined
  ) => any;
  formSignerKey: (
    username: string,
    password: string,
    passwordType: KeyType,
    neededKeyType: KeyType
  ) =>
    | string
    | {
        whaleVaultInfo: {
          keyType: KeyType;
          account: string;
        };
      };
};

export function useFormKeys(): UseFormKeysResult {
  const formKeys = useCallback((name: string, password: string) => {
    const keys: AccountAuthorities = {
      active: "",
      memo: "",
      owner: "",
    };
    const roles = ["active", "owner", "memo"];

    const generatedKeys = Login.generateKeys(
      name,
      password,
      roles,
      defaultToken
    );

    for (const role of roles) {
      keys[role as keyof AccountAuthorities] =
        generatedKeys.pubKeys[role].toString();
    }

    return keys;
  }, []);

  const formWifKeys = useCallback((name: string, password: string) => {
    const keys: AccountAuthorities = {
      active: "",
      memo: "",
      owner: "",
    };
    const roles = ["active", "owner", "memo"];

    const generatedKeys = Login.generateKeys(
      name,
      password,
      roles,
      defaultToken
    );

    for (const role of roles) {
      keys[role as keyof AccountAuthorities] =
        generatedKeys.privKeys[role].toWif();
    }

    return keys;
  }, []);

  const formWifKey = useCallback(
    (username: string, password: string, role?: KeyType) => {
      let fromWif = "";

      try {
        fromWif = PrivateKey.fromWif(password);
      } catch (e) {
        console.log(e);
      }

      return fromWif
        ? fromWif
        : Login.generateKeys(username, password, [role]).privKeys[
            role as KeyType
          ];
    },
    []
  );

  const formSignerKey = useCallback(
    (
      username: string,
      password: string,
      inputedKeyType: KeyType,
      neededKeyType: KeyType
    ) => {
      let signerKey;
      if (inputedKeyType === "password") {
        signerKey = formWifKey(username, password, neededKeyType);
      } else if (
        inputedKeyType === neededKeyType ||
        inputedKeyType === "owner"
      ) {
        signerKey = formWifKey(username, password);
      } else {
        signerKey = {
          whaleVaultInfo: { keyType: neededKeyType, account: username },
        };
      }
      return signerKey;
    },
    [formWifKey]
  );

  return {
    formKeys,
    formWifKeys,
    formWifKey,
    formSignerKey,
  };
}
