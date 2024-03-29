import counterpart from "counterpart";
import Link from "next/link";

import * as Styled from "../TransactionModal.styled";

import { ItemDetails } from "./ItemDetails";

type Props = {
  fee: string;
  account: string;
  price?: string;
  sell?: string;
  buy?: string;
};

export const CreateSwapOrder = ({
  account,
  fee,
  price,
  sell,
  buy,
}: Props): JSX.Element => {
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
          label={counterpart.translate(`field.labels.sell_amount`)}
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

      <ItemDetails
        label={counterpart.translate(`field.labels.fee`)}
        value={fee}
      />
    </>
  );
};
