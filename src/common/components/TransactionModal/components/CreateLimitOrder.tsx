import counterpart from "counterpart";
import Link from "next/link";

import { defaultToken } from "../../../../api/params";
import * as Styled from "../TransactionModal.styled";

import { ItemDetails } from "./ItemDetails";

type Props = {
  fee: number;
  account: string;
  price?: string;
  sell?: string;
  buy?: string;
  expiration?: string;
};

export const CreateLimitOrder = ({
  account,
  fee,
  price,
  sell,
  buy,
  expiration,
}: Props): JSX.Element => {
  const feeValue = String(fee) + " " + defaultToken;

  return (
    <>
      {price && (
        <ItemDetails
          label={counterpart.translate(`field.placeholder.price`)}
          value={price}
        />
      )}
      {sell && (
        <ItemDetails
          label={counterpart.translate(`buttons.sell`)}
          value={sell}
        />
      )}
      {buy && (
        <ItemDetails
          label={counterpart.translate(`field.labels.buy_at_least`)}
          value={buy}
        />
      )}
      <Styled.DetailContainer>
        <p>{counterpart.translate(`field.labels.seller`)}</p>
        <Link href={`/user/${account}`}>{account}</Link>
      </Styled.DetailContainer>
      {expiration && (
        <ItemDetails
          label={counterpart.translate(`field.tableHead.expiration`)}
          value={expiration}
        />
      )}
      <ItemDetails
        label={counterpart.translate(`field.labels.fee`)}
        value={feeValue}
      />
    </>
  );
};
