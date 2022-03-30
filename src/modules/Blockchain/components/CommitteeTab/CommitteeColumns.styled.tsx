import { LinkOutlined, styled } from "../../../../ui/src";
import { colors } from "../../../../ui/src/colors";

export const LastBlock = styled.p`
  color: ${colors.success};
`;
export const MissedBlocks = styled.p`
  color: ${colors.error};
`;
export const urlIcon = styled(LinkOutlined)`
  color: ${colors.additionalBlue};
`;