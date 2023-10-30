import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import counterpart from "counterpart";
import Link from "next/link";

import { LoadingIndicator } from "../../../../common/components";
import { StatsCard } from "../../common";

import * as Styled from "./BlockDetails.styled";
import { TransactionsTable } from "./components";
import { TransactionRow, useBlockDetails } from "./hooks";

type Props = {
  block: number;
};
export const BlockDetails = ({ block }: Props): JSX.Element => {
  const {
    blockDetails,
    hasNextBlock,
    hasPreviousBlock,
    loadingSideBlocks,
    loading,
  } = useBlockDetails(block);

  const renderPreviousBlockLink = hasPreviousBlock ? (
    <Link href={`/blockchain/${Number(block) - 1}`}>
      <LeftOutlined />
    </Link>
  ) : (
    ""
  );
  const renderNextBlockLink = hasNextBlock ? (
    <Link href={`/blockchain/${Number(block) + 1}`}>
      <RightOutlined />
    </Link>
  ) : (
    ""
  );

  return (
    <>
      <Styled.BlockWrapper>
        {loadingSideBlocks ? (
          <Styled.LoadingContainer>
            <LoadingIndicator type="circle" />
          </Styled.LoadingContainer>
        ) : (
          <Styled.BlockNav>
            <span>{renderPreviousBlockLink}</span>
            <Styled.BlockNavItem>
              <Styled.BlockNumber>
                <span>
                  {counterpart.translate(`pages.blocks.blockchain.block`)} #
                  {block}
                </span>
              </Styled.BlockNumber>
              <Styled.BlockTime>{blockDetails.time}</Styled.BlockTime>
            </Styled.BlockNavItem>
            <span>{renderNextBlockLink}</span>
          </Styled.BlockNav>
        )}

        <Styled.StatsCardsDeck>
          <StatsCard
            noData={block === 0}
            title={counterpart.translate(
              `pages.blocks.block_details.block_num`
            )}
            data={`${block}`}
            statsData={[block]}
          />
          <StatsCard
            noData={blockDetails.witness === ""}
            title={counterpart.translate(`pages.blocks.block_details.witness`)}
            data={
              <Link href={`/user/${blockDetails.witness_account_name}`}>
                {`${blockDetails.witness_account_name} (${blockDetails.witness})`}
              </Link>
            }
            statsData={[0]}
          />
          <StatsCard
            noData={false}
            title={counterpart.translate(
              `pages.blocks.block_details.transactions`
            )}
            data={`${(blockDetails.transactions as TransactionRow[]).length}`}
            statsData={[(blockDetails.transactions as TransactionRow[]).length]}
          />
        </Styled.StatsCardsDeck>
        <Styled.TwoColumns>
          <Styled.BlockInfo>
            <Styled.BlockInfoTitle>
              {counterpart.translate(`pages.blocks.block_details.block_id`)}
            </Styled.BlockInfoTitle>
            <p>{blockDetails.blockID}</p>
          </Styled.BlockInfo>
          <Styled.BlockInfo>
            <Styled.BlockInfoTitle>
              {counterpart.translate(`pages.blocks.block_details.merkle_root`)}
            </Styled.BlockInfoTitle>
            <p>{blockDetails.merkleRoot}</p>
          </Styled.BlockInfo>
        </Styled.TwoColumns>
        <Styled.TwoColumns>
          <Styled.BlockInfo>
            <Styled.BlockInfoTitle>
              {counterpart.translate(
                `pages.blocks.block_details.previous_secret`
              )}
            </Styled.BlockInfoTitle>
            <p>{blockDetails.previousSecret}</p>
          </Styled.BlockInfo>
          <Styled.BlockInfo>
            <Styled.BlockInfoTitle>
              {counterpart.translate(`pages.blocks.block_details.next_secret`)}
            </Styled.BlockInfoTitle>
            <p>{blockDetails.nextSecret}</p>
          </Styled.BlockInfo>
        </Styled.TwoColumns>
        <Styled.BlockInfo>
          <Styled.BlockInfoTitle>
            {counterpart.translate(`pages.blocks.block_details.signing_key`)}
          </Styled.BlockInfoTitle>
          <p>{blockDetails.signingKey}</p>
        </Styled.BlockInfo>
        <Styled.BlockInfo>
          <Styled.BlockInfoTitle>
            {counterpart.translate(
              `pages.blocks.block_details.witness_signature`
            )}
          </Styled.BlockInfoTitle>
          <p>{blockDetails.witnessSignature}</p>
        </Styled.BlockInfo>
      </Styled.BlockWrapper>
      <TransactionsTable
        loadingBlockDetails={loading}
        block={block}
        transactionRows={blockDetails.transactions as TransactionRow[]}
      />
    </>
  );
};
