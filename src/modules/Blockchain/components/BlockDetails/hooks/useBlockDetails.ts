import { useCallback, useEffect, useState } from "react";

import { useBlockchain, useFormDate } from "../../../../../common/hooks";

import {
  BlockDetailsType,
  TransactionRow,
  UseBlockDetailsResult,
} from "./useBlockDetails.types";

export function useBlockDetails(block: number): UseBlockDetailsResult {
  const [hasNextBlock, setHasNextBlock] = useState<boolean>(false);
  const [hasPreviousBlock, setHasPreviousBlock] = useState<boolean>(false);
  const [blockDetails, _setBlockDetails] = useState<BlockDetailsType>({
    key: block,
    nextSecret: "",
    previousSecret: "",
    merkleRoot: "",
    blockID: block,
    time: "",
    witness: "",
    signingKey: "",
    witnessSignature: "",
    transactions: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSideBlocks, setLoadingSideBlocks] = useState<boolean>(true);

  const { formLocalDate } = useFormDate();
  const { getBlock2, getDynamicGlobalProperties } = useBlockchain();

  const getBlockDetails = useCallback(async () => {
    try {
      const rawBlock = await getBlock2(Number(block));
      if (rawBlock) {
        const transactions: TransactionRow[] = rawBlock.transactions.map(
          (transaction, index) => {
            return {
              key: index + 1,
              rank: index + 1,
              id: rawBlock.transaction_ids[index],
              expiration: formLocalDate(transaction.expiration, [
                "month",
                "date",
                "year",
                "time",
              ]),
              operations: transaction.operations,
              operationResults: transaction.operation_results,
              refBlockPrefix: transaction.ref_block_prefix,
              refBlockNum: transaction.ref_block_num,
              extensions: transaction.extensions,
              signatures: transaction.signatures,
            };
          }
        );
        return {
          key: block,
          nextSecret: rawBlock.next_secret_hash as string,
          previousSecret: rawBlock.previous_secret,
          merkleRoot: rawBlock.transaction_merkle_root,
          blockID: block,
          time: formLocalDate(rawBlock.timestamp, [
            "month",
            "date",
            "year",
            "time",
          ]),
          witness: rawBlock.witness,
          witness_account_name: rawBlock.witness_account_name,
          signingKey: rawBlock.signing_key,
          witnessSignature: rawBlock.witness_signature,
          transactions: transactions,
        } as BlockDetailsType;
      }
    } catch (e) {
      console.log(e);
    }
  }, [block, getBlock2]);

  const checkSideBlocksExistence = useCallback(async () => {
    let hasPreviousBlock = false;
    let hasNextBlock = false;
    try {
      const dgpo = await getDynamicGlobalProperties();
      if (block > 1) {
        hasPreviousBlock = true;
      }
      if (dgpo && block < dgpo.head_block_number) {
        hasNextBlock = true;
      }
    } catch (e) {
      console.log(e);
    }
    return {
      hasPreviousBlock,
      hasNextBlock,
    };
  }, [getDynamicGlobalProperties, block]);

  useEffect(() => {
    let ignore = false;
    async function setBlockDetails() {
      setLoading(true);
      const blockDetails = await getBlockDetails();
      if (!ignore && blockDetails) {
        _setBlockDetails(blockDetails);
        setLoading(false);
      }
    }
    setBlockDetails();
    return () => {
      ignore = true;
    };
  }, [getBlockDetails, setLoading, _setBlockDetails]);

  useEffect(() => {
    let ignore = false;
    async function setSideBlocksExistence() {
      setLoadingSideBlocks(true);
      const { hasPreviousBlock, hasNextBlock } =
        await checkSideBlocksExistence();
      if (!ignore) {
        setHasNextBlock(hasNextBlock);
        setHasPreviousBlock(hasPreviousBlock);
        setLoadingSideBlocks(false);
      }
    }
    setSideBlocksExistence();
    return () => {
      ignore = true;
    };
  }, [checkSideBlocksExistence]);

  return {
    blockDetails,
    loading,
    hasNextBlock,
    hasPreviousBlock,
    loadingSideBlocks,
  };
}
