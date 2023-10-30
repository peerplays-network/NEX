import counterpart from "counterpart";
import { Login } from "peerplaysjs-lib";
import { useCallback, useMemo, useState } from "react";

import { defaultToken } from "../../../../../api/params";
import { useAccount } from "../../../../../common/hooks";
import { useUserContext } from "../../../../../common/providers";
import {
  Account,
  Authority,
  GeneratedKey,
  PublicKeys,
} from "../../../../../common/types";
import { CheckboxValueType, Form } from "../../../../../ui/src";

import {
  FormValidation,
  KeyManagementForm,
  UseKeyManagementTabResult,
} from "./useKeyManagementTab.types";

export function useKeyManagementTab(): UseKeyManagementTabResult {
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKey[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<CheckboxValueType[]>([]);
  const [keyManagementForm] = Form.useForm<KeyManagementForm>();
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const { validateAccountPassword } = useAccount();
  const { account } = useUserContext();
  const publicKeys = useMemo(() => {
    if (account) {
      const keys = [
        {
          type: "owner",
          key: account.owner.key_auths[0][0],
        },
        {
          type: "active",
          key: account.active.key_auths[0][0],
        },
        {
          type: "memo",
          key: account.options.memo_key,
        },
      ];
      return keys as PublicKeys[];
    }
  }, [account]);

  const handleCheckboxChange = useCallback(
    (checkedValues: CheckboxValueType[]) => {
      setSelectedKeys(checkedValues);
    },
    [setSelectedKeys]
  );

  const downloadPrivateKeys = useCallback(() => {
    const translations: Record<string, string> = {
      Owner: "owner",
      Active: "active",
      Memo: "memo",
      Владелец: "owner",
      Активный: "active",
      Памятка: "memo",
    };
    const roles = selectedKeys.map((key) => translations[key.toString()]);
    const keyFileContentBlocks = [];
    for (const role of roles) {
      const keyIndex = generatedKeys.findIndex((key) => key.label === role);
      const block = `
      \n ###### ${role} ###### 
      \n ${generatedKeys[keyIndex].key} 
      `;
      keyFileContentBlocks.push(block);
    }
    const element = document.createElement("a");
    const fileContents = keyFileContentBlocks.join().replace(/,/g, "\n");
    const file = new Blob([fileContents], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `Peerplays_account_private_keys`;
    document.body.appendChild(element);
    element.click();
    setDownloaded(true);
  }, [selectedKeys, generatedKeys, setDownloaded]);

  const onGo = useCallback(() => {
    const { password } = keyManagementForm.getFieldsValue();
    if (account) {
      const translations: Record<string, string> = {
        Owner: "owner",
        Active: "active",
        Memo: "memo",
        Владелец: "owner",
        Активный: "active",
        Памятка: "memo",
      };
      const roles = selectedKeys.map((key) => translations[key.toString()]);
      const keys = Login.generateKeys(account.name, password, roles);
      const generatedKeys = [] as GeneratedKey[];

      let userKeys;
      for (const role of roles) {
        const privKey = keys.privKeys[role];
        const pubKey = privKey.toPublicKey().toString(defaultToken);
        if (role !== "memo") {
          const permissions = account[role as keyof Account] as Authority;
          userKeys = permissions.key_auths.map((key_auth) => key_auth[0]);
        } else {
          userKeys = [account.options.memo_key];
        }
        if (userKeys.includes(pubKey)) {
          generatedKeys.push({ label: role, key: privKey.toWif() });
        } else {
          generatedKeys.push({ label: role, key: "" });
        }
      }
      setDownloaded(false);
      setGeneratedKeys(generatedKeys);
    }
  }, [
    account,
    keyManagementForm,
    selectedKeys,
    setGeneratedKeys,
    defaultToken,
    setDownloaded,
  ]);

  const validateSelectKeys = (_: unknown) => {
    if (selectedKeys.length > 0) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(counterpart.translate(`field.errors.select_role`))
    );
  };

  const validatePassword = (_: unknown, value: string) => {
    if (account) {
      const { checkPassword } = validateAccountPassword(value, account);
      if (!checkPassword)
        return Promise.reject(
          new Error(counterpart.translate(`field.errors.password_incorrect`))
        );
      return Promise.resolve();
    } else {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.login_first`))
      );
    }
  };

  const formValidation: FormValidation = {
    password: [
      {
        required: true,
        message: counterpart.translate(`field.errors.field_is_required`),
      },
      {
        min: 12,
        message: counterpart.translate(`field.errors.password_should_be_long`),
      },
      { validator: validatePassword },
    ],
    roles: [{ validator: validateSelectKeys }],
  };

  return {
    formValidation,
    keyManagementForm,
    publicKeys,
    generatedKeys,
    handleCheckboxChange,
    downloadPrivateKeys,
    selectedKeys,
    onGo,
    downloaded,
  };
}
