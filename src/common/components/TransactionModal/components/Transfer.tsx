import counterpart from "counterpart";
import Link from "next/link";

import * as Styled from "../TransactionModal.styled";

type Props = {
  fee: number;
  account: string;
  asset: string;
  to: string;
  amount: string;
  blockchain: string;
};

export const Transfer = ({
  account,
  fee,
  asset,
  to,
  amount,
  blockchain,
}: Props): JSX.Element => {
  return (
    <>
      <Styled.DetailContainer>
        <p>{counterpart.translate(`field.placeholder.from`)}</p>
        <Link href={`/user/${account}`}>{account}</Link>
      </Styled.DetailContainer>
      <Styled.DetailContainer>
        <p>{counterpart.translate(`field.labels.blockchain`)}</p>
        <p>{blockchain}</p>
      </Styled.DetailContainer>
      <Styled.DetailContainer>
        <p>{counterpart.translate(`field.placeholder.to`)}</p>
        <Link href={`/user/${to}`}>{to}</Link>
      </Styled.DetailContainer>
      <Styled.DetailContainer>
        <p>{counterpart.translate(`field.placeholder.amount`)}</p>
        <p>{amount}</p>
      </Styled.DetailContainer>
      <Styled.DetailContainer>
        <p>{counterpart.translate(`tableHead.asset`)}</p>
        <p>{asset}</p>
      </Styled.DetailContainer>
      <Styled.DetailContainer>
        <p>{counterpart.translate(`field.labels.fee`)}</p>
        <p>{`${fee}`}</p>
      </Styled.DetailContainer>
    </>
  );
};
