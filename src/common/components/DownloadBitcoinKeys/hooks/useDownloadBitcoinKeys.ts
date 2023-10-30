import counterpart from "counterpart";
import { useState } from "react";

import { useGenerateBitcoinAddress } from "../../GenerateBitcoinAddress/hooks";

import { UseDownloadBitcoinKeysResult } from "./useDownloadBitcoinKeys.types";

type Args = {
  getSidechainAccounts: (accountId: string) => Promise<void>;
};

export function useDownloadBitcoinKeys({
  getSidechainAccounts,
}: Args): UseDownloadBitcoinKeysResult {
  const [downloaded, setDownloaded] = useState<boolean>(true);
  const {
    sessionBitcoinSidechainAccounts,
    setSessionBitcoinSidechainAccounts,
  } = useGenerateBitcoinAddress(getSidechainAccounts);

  if (sessionBitcoinSidechainAccounts && downloaded) {
    setDownloaded(false);
  }

  const downloadPrivateKeys = (sidechainDepositAddress: string): void => {
    const element = document.createElement("a");
    const fileContents = `
      \n##### ${counterpart.translate(
        "file_content.peerplays_btc_deposit_address"
      )} #####
      \nAddress: ${sidechainDepositAddress}
      \n
      \n###### ${counterpart.translate(
        "file_content.btc_deposit_account"
      )} (${counterpart.translate(
      "file_content.btc_deposit_account_description"
    )}) ######
      \nAddress: ${sessionBitcoinSidechainAccounts?.deposit.address}
      \nPublic Key: ${sessionBitcoinSidechainAccounts?.deposit.pubKey}
      \nPrivate Key: ${sessionBitcoinSidechainAccounts?.deposit.privateKey}
      \n
      \n###### ${counterpart.translate(
        `file_content.btc_withdraw_account`
      )} ######
      \nAddress: ${sessionBitcoinSidechainAccounts?.withdraw.address}
      \nPublic Key: ${sessionBitcoinSidechainAccounts?.withdraw.pubKey}
      \nPrivate Key: ${sessionBitcoinSidechainAccounts?.withdraw.privateKey}
      \n
        `;

    const file = new Blob([fileContents], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "Keys.txt";
    element.id = "download-keys";
    document.body.appendChild(element);
    element.click();
    element.remove();
    setDownloaded(true);
    setSessionBitcoinSidechainAccounts(undefined);
  };

  return { downloaded, downloadPrivateKeys };
}
