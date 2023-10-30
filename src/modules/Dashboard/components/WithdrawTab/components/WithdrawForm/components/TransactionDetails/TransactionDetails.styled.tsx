import { styled } from "../../../../../../../../ui/src";
import { breakpoint } from "../../../../../../../../ui/src/breakpoints";

export const TransactionDetails = styled.div`
  margin-bottom: 24px;
`;

export const DetailsWrapper = styled.div`
  display: flex;
  font-size: 12px;
  ${breakpoint.sm} {
    font-size: 14px;
  }
`;

export const DetailsLabelWrapper = styled.div`
  min-width: 150px;
`;

export const AmountsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
