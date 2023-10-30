import { useCallback, useEffect, useState } from "react";

import { useBlockchain } from "../../../../../common/hooks";
import { Block2 } from "../../../../../common/types";
import { TransactionRow } from "../../BlockDetails/hooks";

import { UseTransactionDetails } from "./useTransactionDetails.types";

export function useTransactionDetails(
  block: number,
  transactionId?: string
): UseTransactionDetails {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNextTransition, setHasNextTransition] = useState<boolean>(false);
  const [rawBlock, setRawBlock] = useState<Block2>();
  const [trxInBlock, setTrxInBlock] = useState<number>(0);
  const [hasPreviousTransition, setHasPreviousTransition] =
    useState<boolean>(false);
  const [nextTransactionId, setNextTransactionId] = useState<
    string | undefined
  >();
  const [previousTransactionId, setPreviousTransactionId] = useState<
    string | undefined
  >();
  const [loadingSideTransactions, setLoadingSideTransactions] =
    useState<boolean>(true);
  const [blockTransactions, setBlockTransactions] = useState<TransactionRow[]>(
    []
  );
  const [transactionDetails, setTransactionDetails] = useState<TransactionRow>({
    key: 0,
    rank: 0,
    id: "",
    expiration: "",
    operations: [],
    operationResults: [],
    refBlockPrefix: 0,
    refBlockNum: 0,
    extensions: [],
    signatures: [],
  });
  const { getBlock2 } = useBlockchain();

  //in the state we need the raw block data and the transaction index
  const setTransactionState = useCallback(async () => {
    try {
      setLoading(true);
      if (transactionId !== undefined) {
        const blockData = await getBlock2(Number(block));
        if (blockData) {
          const transactions: TransactionRow[] = blockData.transactions.map(
            (transaction, index) => {
              return {
                key: index + 1,
                rank: index + 1,
                id: blockData.transaction_ids[index],
                expiration: transaction.expiration,
                operations: transaction.operations,
                operationResults: transaction.operation_results,
                refBlockPrefix: transaction.ref_block_prefix,
                refBlockNum: transaction.ref_block_num,
                extensions: transaction.extensions,
                signatures: transaction.signatures,
              };
            }
          );
          setBlockTransactions(transactions);
          setTransactionDetails(transactions[trxInBlock]);
          setRawBlock(blockData);
          setTrxInBlock(blockData.transaction_ids.indexOf(transactionId));
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [getBlock2, block, transactionId, setRawBlock, setTrxInBlock, setLoading]);

  const buildBlockPagination = useCallback(async () => {
    try {
      if (
        transactionId !== undefined &&
        trxInBlock !== undefined &&
        rawBlock !== undefined
      ) {
        setLoadingSideTransactions(true);
        const nextTransaction = blockTransactions[trxInBlock + 1];
        if (nextTransaction) {
          setNextTransactionId(rawBlock?.transaction_ids[trxInBlock + 1]);
          setHasNextTransition(true);
        } else {
          setNextTransactionId(undefined);
          setHasNextTransition(false);
        }
        const previousTransaction = blockTransactions[trxInBlock - 1];
        if (previousTransaction) {
          setPreviousTransactionId(rawBlock?.transaction_ids[trxInBlock - 1]);
          setHasPreviousTransition(true);
        } else {
          setPreviousTransactionId(undefined);
          setHasPreviousTransition(false);
        }
        setLoadingSideTransactions(false);
      } else {
        setLoadingSideTransactions(false);
      }
    } catch (e) {
      console.log(e);
      setHasNextTransition(false);
      setHasPreviousTransition(false);
      setLoadingSideTransactions(false);
    }
  }, [
    rawBlock,
    trxInBlock,
    transactionDetails,
    transactionId,
    blockTransactions,
    setHasNextTransition,
    setHasPreviousTransition,
    setLoadingSideTransactions,
  ]);

  useEffect(() => {
    setTransactionState();
  }, [setTransactionState]);

  useEffect(() => {
    buildBlockPagination();
  }, [buildBlockPagination]);

  return {
    loading,
    blockTransactions,
    transactionDetails,
    hasNextTransition,
    hasPreviousTransition,
    loadingSideTransactions,
    trxInBlock,
    nextTransactionId,
    previousTransactionId,
  };
}
