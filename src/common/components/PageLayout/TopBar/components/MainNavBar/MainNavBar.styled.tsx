import {
  styled,
  Avatar as UiAvatar,
  Button as UiButton,
} from "../../../../../../ui/src";
import { breakpoint } from "../../../../../../ui/src/breakpoints";
import { colors } from "../../../../../../ui/src/colors";

export const MainNavBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  color: ${colors.white};
  .hambuger {
    font-size: 2em;
    font-weight: bold;
    margin-left: 10px;
  }
  .ant-avatar {
    background: ${colors.successTag};
  }
  .ant-badge-dot {
    width: 8px;
    min-width: 6px;
    height: 8px;
    box-shadow: none;
    transform: translate(-80%, 70%);
  }

  .ant-avatar.ant-avatar-circle.ant-avatar-icon {
    background: bottom;
  }

  .ant-avatar.ant-avatar-icon {
    font-size: 1.2em;
    margin-top: 1.5px;
}
  .bell {
    font-size: 1.2em;
    font-weight: bold;
    margin-right: 10px;
  }
`;

export const MenuWrapper = styled.div`{
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: ${colors.white};
  color: ${colors.textColor};
  z-index: 2;
  padding-top: 95px;
  &.open{
    display: block;
    flex-direction: column;
  }
  ${breakpoint.xs} {
      position: absolute;
      top:75px;
      height: inherit;
      width: 210px;
      background: transparent;
      padding-top: 0;
      &.main-menu-wrapper{
          right:32px;
      }
      &.profile-wrapper{
          right:60px;
      }
      &.notification-menu-wrapper{
          right:110px;
          width:325px;
          min-height:311px;
          border-radius: 4px;
          opacity: 1;
      }
  }
`;

export const CloseButton = styled(UiButton)`
  color: ${colors.textColor};
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9999;
  text-align: center;
  margin: 50px 25px 0 20px;
  ${breakpoint.xs} {
    display: none;
  }
`;

export const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  ${breakpoint.xs} {
    display: none;
  }
`;

export const MainNavBarAvitar = styled(UiAvatar)``;
