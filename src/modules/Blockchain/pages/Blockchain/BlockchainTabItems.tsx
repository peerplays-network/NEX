import counterpart from "counterpart";
import { ReactNode, useCallback } from "react";

import {
  AccountsTab,
  AssetsTab,
  BlockchainTab,
  BlockDetails,
  CommitteeTab,
  FeesTab,
  SonsTab,
  TransactionDetails,
  WitnessesTab,
} from "../../components";

export const BlockchainTabItems = (
  block: string | string[] | undefined,
  blockNum: number | undefined,
  transactionId: string | undefined
): { key: string; label: ReactNode; children: ReactNode }[] => {
  const BlockTab = useCallback((): JSX.Element => {
    return (
      <>
        {block ? (
          <>
            {transactionId ? (
              <TransactionDetails
                block={blockNum as number}
                transaction={transactionId}
              />
            ) : (
              <BlockDetails block={blockNum as unknown as number} />
            )}
          </>
        ) : (
          <BlockchainTab />
        )}
      </>
    );
  }, [block, transactionId, blockNum]);

  const label = [
    "blockchain",
    "assets",
    "witnesses",
    "committees",
    "sons",
    "fees",
    "accounts",
  ];
  const key = [
    "blockchain",
    "assets",
    "witnesses",
    "committees",
    "sons",
    "fees",
  ];
  const children = [
    <BlockTab key="blockchain" />,
    <AssetsTab key="assets" />,
    <WitnessesTab key="witnesses" />,
    <CommitteeTab key="committees" />,
    <SonsTab key="sons" />,
    <FeesTab key="fees" />,
    <AccountsTab key="accounts" />,
  ];

  return label.map((item, index) => {
    return {
      label: counterpart.translate(`pages.blocks.${item}.${item}`),
      key: key[index],
      children: children[index],
    };
  });
};
