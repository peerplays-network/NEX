import { CopyButton } from "..";
import { SidechainAccount } from "../../types";

import * as Styled from "./AddressGenerated.styled";

type Props = {
  label: string;
  sidechainAccount: SidechainAccount;
};
export const AddressGenerated = ({
  label,
  sidechainAccount,
}: Props): JSX.Element => {
  return (
    <>
      <Styled.GeneratedAddressLabel>{label}</Styled.GeneratedAddressLabel>
      <Styled.GeneratedAddress
        size="small"
        suffix={
          <CopyButton
            copyValue={`${sidechainAccount.deposit_address}`}
          ></CopyButton>
        }
        value={sidechainAccount?.deposit_address}
        disabled
      />
    </>
  );
};
