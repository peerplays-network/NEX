import counterpart from "counterpart";
import { cloneDeep, uniq } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  BITCOIN_SON_VOTE_IDENTIFIER,
  COMMITTEE_VOTE_IDENTIFIER,
  defaultToken,
  ETHEREUM_SON_VOTE_IDENTIFIER,
  HIVE_SON_VOTE_IDENTIFIER,
  WITNESS_VOTE_IDENTIFIER,
} from "../../../../../../api/params";
import { isArrayEqual } from "../../../../../../api/utils";
import {
  TransactionMessageActionType,
  useAccount,
  useAsset,
  useBlockchain,
  useSons,
  useTransactionBuilder,
  useTransactionMessage,
  useUpdateAccountTransactionBuilder,
} from "../../../../../../common/hooks";
import {
  useAssetsContext,
  useUserContext,
} from "../../../../../../common/providers";
import {
  Asset,
  CommitteeMember,
  FullAccount,
  GlobalProperties,
  Member,
  MemberType,
  Sidechain,
  SignerKey,
  SonAccount,
  WitnessAccount,
} from "../../../../../../common/types";
import { VoteRow, VoteStatus } from "../../../../types";

import { UseVoteTabResult } from "./useVoteTab.types";

type Args = {
  tab: string;
  tabAllMembers: Member[];
  fullAccount: FullAccount | undefined;
  getUserVotes: () => Promise<void>;
  allMembersIds: [string, string][];
  votesLoading: boolean;
  totalGpos: number;
  tabServerApprovedVotesIds: string[];
};

export function useVoteTab({
  tab,
  tabAllMembers,
  allMembersIds,
  fullAccount,
  getUserVotes,
  totalGpos,
  votesLoading,
  tabServerApprovedVotesIds,
}: Args): UseVoteTabResult {
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [isVotesChanged, setIsVotesChanged] = useState<boolean>(false);
  const [globalProperties, _setGlobalProperties] = useState<
    GlobalProperties | undefined
  >();
  const [updateAccountFee, setUpdateAccountFee] = useState<number>();
  const afterCloseTransactionModal = useRef<() => void>();

  const { transactionMessageState, dispatchTransactionMessage } =
    useTransactionMessage();
  const { formAssetBalance } = useAsset();
  const { defaultAsset } = useAssetsContext();
  const { formAccountBalancesByName } = useAccount();
  const { id, assets, name, localStorageAccount } = useUserContext();
  const { buildUpdateAccountTransaction } =
    useUpdateAccountTransactionBuilder();
  const { getTrxFee, buildTrx } = useTransactionBuilder();
  const { getGlobalProperties } = useBlockchain();
  const { getActiveSons, getSonAccountVotes, getSonAccountVoteId } = useSons();

  const sortVotesRows = useCallback((votes: VoteRow[]) => {
    const sorter = (a: VoteRow, b: VoteRow) =>
      Number(b.votes.split(" ")[0]) - Number(a.votes.split(" ")[0]);
    votes.sort(sorter);
    return votes.map((vote, index) => {
      return { ...vote, rank: index + 1 };
    }) as VoteRow[];
  }, []);

  const formCommitteeWitnessVoteRow = useCallback(
    (
      member: WitnessAccount | CommitteeMember,
      allMemberIds: [string, string][],
      defaultAsset: Asset,
      globalProperties: GlobalProperties
    ): VoteRow => {
      let voteType: MemberType;
      let voteActive: boolean;
      let missedBlocks = 0;
      if (parseInt(member.vote_id.charAt(0)) === 0) {
        voteType = "committees";
        voteActive =
          globalProperties["active_committee_members"].indexOf(member.id) >= 0
            ? true
            : false;
      } else {
        voteType = "witnesses";
        voteActive =
          globalProperties["active_witnesses"].indexOf(member.id) >= 0
            ? true
            : false;
        missedBlocks = (member as WitnessAccount).total_missed;
      }
      const name = allMemberIds.filter(
        (memberId) => memberId[1] === member.id
      )[0][0];
      const votesAsset = formAssetBalance(
        defaultAsset,
        Number(member.total_votes)
      );

      return {
        id: member.vote_id,
        key: member.vote_id,
        rank: 0,
        type: voteType,
        name: name,
        url: member.url,
        votes: `${votesAsset?.amount} ${votesAsset?.symbol}`,
        missedBlocks: missedBlocks,
        possibleAction: undefined,
        active: voteActive,
        status: tabServerApprovedVotesIds.some((id) => id === member.vote_id)
          ? VoteStatus.APPROVED
          : VoteStatus.UNAPPROVED,
      } as VoteRow;
    },
    [formAssetBalance, tabServerApprovedVotesIds]
  );

  const formSonVoteRow = useCallback(
    (
      member: SonAccount,
      allMemberIds: [string, string][],
      defaultAsset: Asset,
      globalProperties: GlobalProperties
    ): VoteRow => {
      // Maybe some chains are missing for the member
      const { bitcoinVoteId, ethereumVoteId, hiveVoteId } =
        getSonAccountVoteId(member);
      const memberHasBitcoinChain = bitcoinVoteId !== undefined;
      const memberHasEthereumChain = ethereumVoteId !== undefined;
      const memberHasHiveChain = hiveVoteId !== undefined;

      // Statuses
      const bitcoinStatus = tabServerApprovedVotesIds.some(
        (id) => id === bitcoinVoteId
      )
        ? VoteStatus.APPROVED
        : VoteStatus.UNAPPROVED;
      const ethereumStatus = tabServerApprovedVotesIds.some(
        (id) => id === ethereumVoteId
      )
        ? VoteStatus.APPROVED
        : VoteStatus.UNAPPROVED;
      const hiveStatus = tabServerApprovedVotesIds.some(
        (id) => id === hiveVoteId
      )
        ? VoteStatus.APPROVED
        : VoteStatus.UNAPPROVED;
      const statuses = {
        bitcoin: !memberHasBitcoinChain ? undefined : bitcoinStatus,
        ethereum: !memberHasEthereumChain ? undefined : ethereumStatus,
        hive: !memberHasHiveChain ? undefined : hiveStatus,
      };

      // Actives
      const { bitcoinActiveSonsIds, ethereumActiveSonsIds, hiveActiveSonsIds } =
        getActiveSons(globalProperties);
      const { bitcoinVoteAsset, ethereumVoteAsset, hiveVoteAsset } =
        getSonAccountVotes(member, defaultAsset);
      const bitcoinActive =
        bitcoinActiveSonsIds.indexOf(member.id) >= 0 ? true : false;
      const ethereumActive =
        ethereumActiveSonsIds.indexOf(member.id) >= 0 ? true : false;
      const hiveActive =
        hiveActiveSonsIds.indexOf(member.id) >= 0 ? true : false;
      const actives = {
        bitcoin: !memberHasBitcoinChain ? undefined : bitcoinActive,
        ethereum: !memberHasEthereumChain ? undefined : ethereumActive,
        hive: !memberHasHiveChain ? undefined : hiveActive,
      };

      // Common properties
      const name = allMemberIds.filter(
        (memberId) => memberId[1] === member.id
      )[0][0];
      const votesAsset = formAssetBalance(
        defaultAsset,
        member.total_votes.map((member) => member[1]).reduce((a, b) => a + b, 0)
      );
      const activeChains: string[] = [];
      if (actives.bitcoin) activeChains.push(Sidechain.BITCOIN);
      if (actives.ethereum) activeChains.push(Sidechain.ETHEREUM);
      if (actives.hive) activeChains.push(Sidechain.HIVE);
      let approvals = 0;
      //loop through statuses and count approvals
      Object.values(statuses).forEach((status) => {
        if (status === VoteStatus.APPROVED) approvals++;
      });
      let status;
      switch (true) {
        case approvals < 1:
          //no approvals
          status = VoteStatus.UNAPPROVED;
          break;
        case approvals <
          Object.values(statuses).filter((status) => status !== undefined)
            .length:
          //partial approval
          status = VoteStatus.PARTIALLY_APPROVED;
          break;
        case approvals ===
          Object.values(statuses).filter((status) => status !== undefined)
            .length:
          //full approvals
          status = VoteStatus.APPROVED;
          break;
        default:
          status = VoteStatus.UNAPPROVED;
      }

      return {
        id: member.id,
        key: member.id,
        rank: 0,
        type: "sons",
        name: name,
        url: member.url,
        possibleAction: undefined,
        status: status,
        active: Object.values(actives).some((active) => !active) ? false : true,
        votes: `${votesAsset?.amount} ${votesAsset?.symbol}`,
        // son specific
        hasSidechains: {
          bitcoin: memberHasBitcoinChain,
          ethereum: memberHasEthereumChain,
          hive: memberHasHiveChain,
        },
        activeChains: activeChains,
        actives: actives,
        statuses: statuses,
        possibleActions: {
          bitcoin: undefined,
          ethereum: undefined,
          hive: undefined,
        },
        sidechainVotes: {
          bitcoin: `${bitcoinVoteAsset?.amount} ${bitcoinVoteAsset?.symbol}`,
          ethereum: `${ethereumVoteAsset?.amount} ${ethereumVoteAsset?.symbol}`,
          hive: `${hiveVoteAsset?.amount} ${hiveVoteAsset?.symbol}`,
        },
        sidechainVotesIds: {
          bitcoin: bitcoinVoteId,
          ethereum: ethereumVoteId,
          hive: hiveVoteId,
        },
      } as VoteRow;
    },
    [
      getActiveSons,
      getSonAccountVotes,
      getSonAccountVoteId,
      formAssetBalance,
      tabServerApprovedVotesIds,
    ]
  );

  const tableRows = useMemo(() => {
    if (
      !votesLoading &&
      defaultAsset !== undefined &&
      globalProperties !== undefined
    ) {
      if (tab === "sons") {
        return sortVotesRows(
          tabAllMembers.map((member) => {
            return formSonVoteRow(
              member as SonAccount,
              allMembersIds,
              defaultAsset,
              globalProperties
            );
          })
        );
      } else {
        return sortVotesRows(
          tabAllMembers.map((member) => {
            return formCommitteeWitnessVoteRow(
              member as WitnessAccount | CommitteeMember,
              allMembersIds,
              defaultAsset,
              globalProperties
            );
          })
        );
      }
    } else {
      return [] as VoteRow[];
    }
  }, [
    votesLoading,
    defaultAsset,
    globalProperties,
    tab,
    sortVotesRows,
    tabAllMembers,
    formCommitteeWitnessVoteRow,
    formSonVoteRow,
    allMembersIds,
    fullAccount,
  ]);
  const [localApprovedVotesIds, setLocalApprovedVotesIds] = useState<string[]>(
    tabServerApprovedVotesIds
  );
  const [prevTabServerApprovedVotesIds, setPrevTabServerApprovedVotesIds] =
    useState<string[]>([]);
  if (!isArrayEqual(prevTabServerApprovedVotesIds, tabServerApprovedVotesIds)) {
    setPrevTabServerApprovedVotesIds(tabServerApprovedVotesIds);
    setLocalApprovedVotesIds(tabServerApprovedVotesIds);
  }

  const checkVotesChanged = useCallback(
    (serverApprovedVotesIds: string[], localApprovedVotesIds: string[]) => {
      const isVotesChanged = !isArrayEqual(
        serverApprovedVotesIds,
        localApprovedVotesIds
      );
      return isVotesChanged;
    },
    [isArrayEqual]
  );

  // Trx and fee creation
  const createUpdateAccountTrx = useCallback(
    (localApprovedVotesIds: string[]) => {
      const witnessesIdentifiers = [WITNESS_VOTE_IDENTIFIER];
      const committeesIdentifiers = [COMMITTEE_VOTE_IDENTIFIER];
      const sonsIdentifiers = [
        BITCOIN_SON_VOTE_IDENTIFIER,
        HIVE_SON_VOTE_IDENTIFIER,
        ETHEREUM_SON_VOTE_IDENTIFIER,
      ];
      const membersIdentifiers: {
        [tab: string]: number[];
      } = {
        witnesses: witnessesIdentifiers,
        sons: sonsIdentifiers,
        committees: committeesIdentifiers,
      };
      const memberIdentifier =
        membersIdentifiers[tab] !== undefined
          ? membersIdentifiers[tab]
          : membersIdentifiers["witnesses"];

      if (fullAccount !== undefined && id) {
        const new_options = cloneDeep(fullAccount.account.options);

        // Other tabs approved votes
        const allTabsServerApprovedVotesIds = fullAccount.account.options.votes;
        const otherTabsServerApprovedVotesIds =
          allTabsServerApprovedVotesIds.filter(
            (approvedVoteId) =>
              !memberIdentifier.includes(parseInt(approvedVoteId.split(":")[0]))
          );

        const allApprovedVotesIds = [
          ...localApprovedVotesIds,
          ...otherTabsServerApprovedVotesIds,
        ];

        new_options.votes = otherTabsServerApprovedVotesIds
          .concat(localApprovedVotesIds)
          .sort((a, b) => {
            const aSplit = a.split(":");
            const bSplit = b.split(":");

            return parseInt(aSplit[1], 10) - parseInt(bSplit[1], 10);
          });

        new_options.num_witness = allApprovedVotesIds.filter((voteId) =>
          witnessesIdentifiers.includes(parseInt(voteId.split(":")[0]))
        ).length;
        new_options.num_committee = allApprovedVotesIds.filter((voteId) =>
          committeesIdentifiers.includes(parseInt(voteId.split(":")[0]))
        ).length;
        const bitcoin_num_son = allApprovedVotesIds.filter(
          (voteId) =>
            parseInt(voteId.split(":")[0]) === BITCOIN_SON_VOTE_IDENTIFIER
        ).length;
        const ethereum_num_son = allApprovedVotesIds.filter(
          (voteId) =>
            parseInt(voteId.split(":")[0]) === ETHEREUM_SON_VOTE_IDENTIFIER
        ).length;
        const hive_num_son = allApprovedVotesIds.filter(
          (voteId) =>
            parseInt(voteId.split(":")[0]) === HIVE_SON_VOTE_IDENTIFIER
        ).length;
        new_options.extensions.num_son = [
          [Sidechain.BITCOIN, bitcoin_num_son],
          [Sidechain.ETHEREUM, ethereum_num_son],
          [Sidechain.HIVE, hive_num_son],
        ];

        const trx = buildUpdateAccountTransaction(
          {
            new_options,
            extensions: {
              value: { update_last_voting_time: true },
            },
          },
          id
        );
        return trx;
      }
    },
    [tab, fullAccount, id, buildUpdateAccountTransaction]
  );
  const calculateUpdateAccountFee = useCallback(
    async (localApprovedVotesIds: string[]) => {
      const trx = createUpdateAccountTrx(localApprovedVotesIds);

      if (trx !== undefined) {
        const fee = await getTrxFee([trx]);
        if (fee !== undefined) {
          return fee;
        }
      }
    },
    [createUpdateAccountTrx, getTrxFee]
  );
  const calculateAndSetFee = useCallback(
    async (approvedVotesIds: string[]) => {
      const fee = await calculateUpdateAccountFee(approvedVotesIds);
      setUpdateAccountFee(fee);
    },
    [calculateUpdateAccountFee, setUpdateAccountFee]
  );

  // Events
  const resetChanges = useCallback(() => {
    setIsVotesChanged(false);
    setLocalApprovedVotesIds(tabServerApprovedVotesIds);
    calculateAndSetFee(tabServerApprovedVotesIds);
  }, [
    setIsVotesChanged,
    setLocalApprovedVotesIds,
    tabServerApprovedVotesIds,
    calculateAndSetFee,
  ]);
  const addVote = useCallback(
    (voteId: string) => {
      const newLocalApprovedVotesIds = [...localApprovedVotesIds, voteId];
      setLocalApprovedVotesIds(newLocalApprovedVotesIds);
      const votesChanged = checkVotesChanged(
        tabServerApprovedVotesIds,
        newLocalApprovedVotesIds
      );
      setIsVotesChanged(votesChanged);
      setConfirmed(false);
      calculateAndSetFee(newLocalApprovedVotesIds);
      if (afterCloseTransactionModal.current) {
        afterCloseTransactionModal.current = undefined;
      }
    },
    [
      localApprovedVotesIds,
      setLocalApprovedVotesIds,
      checkVotesChanged,
      tabServerApprovedVotesIds,
      setIsVotesChanged,
      setConfirmed,
      calculateAndSetFee,
      afterCloseTransactionModal,
      afterCloseTransactionModal.current,
    ]
  );
  const removeVote = useCallback(
    (voteId: string) => {
      const newLocalApprovedVotesIds = localApprovedVotesIds.filter(
        (vote_id) => vote_id !== voteId
      );
      setLocalApprovedVotesIds(newLocalApprovedVotesIds);
      const votesChanged = checkVotesChanged(
        tabServerApprovedVotesIds,
        newLocalApprovedVotesIds
      );
      setIsVotesChanged(votesChanged);
      setConfirmed(false);
      calculateAndSetFee(newLocalApprovedVotesIds);
      if (afterCloseTransactionModal.current) {
        afterCloseTransactionModal.current = undefined;
      }
    },
    [
      localApprovedVotesIds,
      setLocalApprovedVotesIds,
      checkVotesChanged,
      tabServerApprovedVotesIds,
      setIsVotesChanged,
      setConfirmed,
      calculateAndSetFee,
      afterCloseTransactionModal,
      afterCloseTransactionModal.current,
    ]
  );

  const voteToAllSidechains = useCallback(
    (sonAccountId: string) => {
      const sonRow = tableRows.find(
        (row) => row.id === sonAccountId
      ) as VoteRow;
      if (sonRow.sidechainVotesIds) {
        const votesIds = Object.values(sonRow.sidechainVotesIds).filter(
          (voteId) => voteId !== undefined
        );
        const newLocalApprovedVotesIds = uniq([
          ...localApprovedVotesIds,
          ...votesIds,
        ]);
        setLocalApprovedVotesIds(newLocalApprovedVotesIds);
        const votesChanged = checkVotesChanged(
          tabServerApprovedVotesIds,
          newLocalApprovedVotesIds
        );
        setIsVotesChanged(votesChanged);
        setConfirmed(false);
        calculateAndSetFee(newLocalApprovedVotesIds);
        if (afterCloseTransactionModal.current) {
          afterCloseTransactionModal.current = undefined;
        }
      }
    },
    [
      tableRows,
      localApprovedVotesIds,
      setLocalApprovedVotesIds,
      checkVotesChanged,
      tabServerApprovedVotesIds,
      setIsVotesChanged,
      setConfirmed,
      calculateAndSetFee,
      afterCloseTransactionModal,
      afterCloseTransactionModal.current,
    ]
  );

  const removeAllSidechainsVotes = useCallback(
    (sonAccountId: string) => {
      const sonRow = tableRows.find(
        (row) => row.id === sonAccountId
      ) as VoteRow;
      if (sonRow.sidechainVotesIds) {
        const votesIds = Object.values(sonRow.sidechainVotesIds).filter(
          (voteId) => voteId !== undefined
        );
        const newLocalApprovedVotesIds = localApprovedVotesIds.filter(
          (vote_id) => !votesIds.includes(vote_id)
        );
        setLocalApprovedVotesIds(newLocalApprovedVotesIds);
        const votesChanged = checkVotesChanged(
          tabServerApprovedVotesIds,
          newLocalApprovedVotesIds
        );
        setIsVotesChanged(votesChanged);
        setConfirmed(false);
        calculateAndSetFee(newLocalApprovedVotesIds);
        if (afterCloseTransactionModal.current) {
          afterCloseTransactionModal.current = undefined;
        }
      }
    },
    [
      tableRows,
      localApprovedVotesIds,
      setLocalApprovedVotesIds,
      checkVotesChanged,
      tabServerApprovedVotesIds,
      setIsVotesChanged,
      setConfirmed,
      calculateAndSetFee,
      afterCloseTransactionModal,
      afterCloseTransactionModal.current,
    ]
  );
  // submit changes
  const validateVoting = useCallback(
    (votingFee: number) => {
      const userDefaultAsset = assets.find(
        (asset) => asset.symbol === defaultToken
      );
      if (
        userDefaultAsset === undefined ||
        (userDefaultAsset.amount as number) < votingFee
      ) {
        return counterpart.translate(`field.errors.balance_not_enough_to_pay`);
      }
      if (totalGpos <= 0) {
        return counterpart.translate(`field.errors.need_to_vest_gpos`);
      }
      return undefined;
    },
    [assets, defaultToken, totalGpos]
  );
  const handleVoting = useCallback(
    async (signerKey: SignerKey) => {
      const votingErrorMessage = validateVoting(updateAccountFee as number);
      if (votingErrorMessage) {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.ERROR,
          message: votingErrorMessage,
        });
        return;
      }
      dispatchTransactionMessage({
        type: TransactionMessageActionType.CLEAR,
        message: votingErrorMessage,
      });

      let trxResult;
      try {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADING,
        });
        const trx = await createUpdateAccountTrx(localApprovedVotesIds);
        trxResult = await buildTrx([trx], [signerKey]);
      } catch (error) {
        console.log(error);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.unable_transaction`),
        });
      }
      if (trxResult) {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_SUCCESS,
          message: counterpart.translate(`field.success.published_votes`),
        });

        afterCloseTransactionModal.current = () => {
          formAccountBalancesByName(localStorageAccount);
          getUserVotes();
          setIsVotesChanged(false);
          setConfirmed(true);
        };
      } else {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.unable_transaction`),
        });
      }
    },
    [
      validateVoting,
      updateAccountFee,
      dispatchTransactionMessage,
      createUpdateAccountTrx,
      localApprovedVotesIds,
      buildTrx,
      formAccountBalancesByName,
      localStorageAccount,
      getUserVotes,
      setIsVotesChanged,
      afterCloseTransactionModal,
      afterCloseTransactionModal.current,
    ]
  );

  useEffect(() => {
    let ignore = false;
    async function setGlobalProperties() {
      const gpo = await getGlobalProperties();
      if (!ignore) {
        _setGlobalProperties(gpo);
      }
    }
    setGlobalProperties();
    return () => {
      ignore = true;
    };
  }, [getGlobalProperties, _setGlobalProperties]);

  useEffect(() => {
    let ignore = false;
    async function setInitialUpdateAccountFee() {
      const initialFee = await calculateUpdateAccountFee(
        tabServerApprovedVotesIds
      );
      if (!ignore) {
        setUpdateAccountFee(initialFee);
      }
    }
    setInitialUpdateAccountFee();
    return () => {
      ignore = true;
    };
  }, [
    calculateUpdateAccountFee,
    setUpdateAccountFee,
    tabServerApprovedVotesIds,
  ]);

  return {
    name,
    confirmed,
    tableRows,
    isVotesChanged,
    resetChanges,
    addVote,
    removeVote,
    handleVoting,
    transactionMessageState,
    dispatchTransactionMessage,
    updateAccountFee,
    localApprovedVotesIds,
    afterSuccessTransactionModalClose: afterCloseTransactionModal.current,
    voteToAllSidechains,
    removeAllSidechainsVotes,
  };
}
