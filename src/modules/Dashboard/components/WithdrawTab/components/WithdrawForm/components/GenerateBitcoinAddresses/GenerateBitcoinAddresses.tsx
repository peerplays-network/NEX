import { BITCOIN_ASSET_SYMBOL } from "../../../../../../../../api/params";
import { GenerateBitcoinAddress } from "../../../../../../../../common/components";
import { SidechainAccount } from "../../../../../../../../common/types";

type Props = {
  isLoggedIn: boolean;
  selectedAssetSymbol: string;
  bitcoinSidechainAccount:
    | {
        account: SidechainAccount;
        hasDepositAddress: boolean;
      }
    | undefined;
  loadingSidechainAccounts: boolean;
  getSidechainAccounts: (accountId: string) => Promise<void>;
};
export const GenerateBitcoinAddresses = ({
  isLoggedIn,
  selectedAssetSymbol,
  bitcoinSidechainAccount,
  loadingSidechainAccounts,
  getSidechainAccounts,
}: Props): JSX.Element => {
  if (isLoggedIn) {
    if (selectedAssetSymbol === BITCOIN_ASSET_SYMBOL) {
      return (!bitcoinSidechainAccount ||
        !bitcoinSidechainAccount.hasDepositAddress) &&
        !loadingSidechainAccounts ? (
        <GenerateBitcoinAddress getSidechainAccounts={getSidechainAccounts} />
      ) : (
        <></>
      );
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
};
