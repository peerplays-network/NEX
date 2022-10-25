import counterpart from "counterpart";
import Link from "next/link";

import {
  Card,
  PoweroffOutlined,
  SettingOutlined,
} from "../../../../../../ui/src";
import { Vote } from "../../../../../../ui/src/icons";
import { useUserContext, useViewportContext } from "../../../../../providers";
import { MenuItem } from "../MenuItem";

import * as Styled from "./ProfileMenu.styled";

const { Meta } = Card;

export const ProfileMenu = (): JSX.Element => {
  const { localStorageAccount } = useUserContext();
  const { sm } = useViewportContext();

  return (
    <Styled.ProfileMenu
      bordered={false}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Meta
        avatar={
          <Styled.ProfileAvatar>
            {localStorageAccount?.charAt(0)}
          </Styled.ProfileAvatar>
        }
        title={`${counterpart.translate(
          `field.labels.hello`
        )} ${localStorageAccount}!`}
        description={`@${localStorageAccount}`}
      />
      <ul>
        {sm ? (
          <>
            <li>
              <MenuItem
                href="/voting"
                icon={<Vote className={"menu-icon"} />}
                label={counterpart.translate(`pages.voting.heading`)}
              />
            </li>
            {/* <li>
              <MenuItem
                href="/contacts"
                icon={<Contacts className={"menu-icon"} />}
                label="Contacts"
              />
            </li> */}
          </>
        ) : (
          <li className={"link"}>
            <Link href={`/user/${localStorageAccount}`}>
              <a>{counterpart.translate(`links.see_all_account_activity`)}</a>
            </Link>
          </li>
        )}

        <li>
          <MenuItem
            href="/settings"
            icon={<SettingOutlined className={"menu-icon"} />}
            label={counterpart.translate(`pages.settings.heading`)}
          />
        </li>
        {sm ? (
          <li className={"link"}>
            <Link href={`/user/${localStorageAccount}`}>
              <a>{counterpart.translate(`links.see_all_account_activity`)}</a>
            </Link>
          </li>
        ) : (
          " "
        )}
        <li className={"logout"}>
          <MenuItem
            href="/logout"
            icon={<PoweroffOutlined className={"menu-icon"} />}
            label={counterpart.translate(`pages.logout.heading`)}
          />
        </li>
      </ul>
    </Styled.ProfileMenu>
  );
};
