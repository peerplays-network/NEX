import { useCallback } from "react";

import { useFormKeys } from "..";
import { FAUCET_URL } from "../../../api/params";
import { FullAccount, SignupForm } from "../../types";

import { useAccount } from "./useAccount";

export function useCreateAccount(): {
  createAccount: (data: SignupForm) => Promise<FullAccount | string>;
} {
  const { getFullAccount } = useAccount();
  const { formKeys } = useFormKeys();

  const createAccount = useCallback(
    async (data: SignupForm) => {
      const keys = formKeys(data.username, data.password);
      const account = {
        name: data.username,
        active_key: keys?.active,
        memo_key: keys.memo,
        owner_key: keys.owner,
        refcode: null,
      };
      try {
        const newUser = await fetch(FAUCET_URL as string, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ account }),
        }).then((e) => e.json());
        if (newUser.account) {
          const fullAccount = await getFullAccount(newUser.account.name, false);
          return fullAccount;
        } else {
          console.log(newUser.error);
          return newUser?.error?.base[0] || "";
        }
      } catch (e) {
        console.log(e);
        return "";
      }
    },
    [formKeys, getFullAccount]
  );
  return {
    createAccount,
  };
}
