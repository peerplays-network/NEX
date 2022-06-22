import counterpart from "counterpart";

import {
  DollarOutlined,
  MenuCard,
  PoweroffOutlined,
  SettingOutlined,
  Switch,
  UserOutlined,
} from "../../../../../../ui/src";
import {
  Blockchain,
  Dashboard,
  Market,
  Vote,
} from "../../../../../../ui/src/icons";
import {
  useMenuContext,
  useSettingsContext,
  useUserContext,
  useViewportContext,
} from "../../../../../providers";
import { MenuItem } from "../MenuItem";

import { useAdvancedMode } from "./hooks";

export const MainNav = (): JSX.Element => {
  const { advancedMode, handleAdvancedModeChange } = useAdvancedMode();
  const { localStorageAccount } = useUserContext();
  const { exchanges } = useSettingsContext();
  const { sm } = useViewportContext();
  const { openMenu, closeMenu } = useMenuContext();
  return (
    <MenuCard bordered={false}>
      <ul>
        {localStorageAccount ? (
          ""
        ) : (
          <li>
            <MenuItem
              href="/login"
              icon={<PoweroffOutlined className={"menu-icon"} />}
              label={counterpart.translate(`pages.login.heading`)}
              onClick={closeMenu}
            />
          </li>
        )}

        <li>
          <MenuItem
            href="/dashboard"
            icon={<Dashboard className={"menu-icon"} />}
            label={counterpart.translate(`pages.dashboard.heading`)}
            onClick={closeMenu}
          />
        </li>
        <li>
          <MenuItem
            href={`/market/${exchanges.active}`}
            icon={<Market className={"menu-icon"} />}
            label={counterpart.translate(`pages.market.heading`)}
            onClick={closeMenu}
          />
        </li>
        <li>
          <MenuItem
            href="/blockchain"
            icon={<Blockchain className={"menu-icon"} />}
            label={counterpart.translate(`pages.blocks.heading`)}
            onClick={closeMenu}
          />
        </li>
        {!localStorageAccount ? (
          ""
        ) : (
          <>
            <li>
              <MenuItem
                href="/wallet"
                icon={<DollarOutlined className={"menu-icon"} />}
                label={counterpart.translate(`pages.wallet.heading`)}
                onClick={closeMenu}
              />
            </li>
            {sm ? (
              <li>
                <MenuItem
                  onClick={() => openMenu("profile")}
                  icon={<UserOutlined className={"menu-icon avitar"} />}
                  label={counterpart.translate(`links.profile`)}
                />
              </li>
            ) : (
              ""
            )}
            <li>
              <MenuItem
                href="/settings"
                icon={<SettingOutlined className={"menu-icon"} />}
                label={counterpart.translate(`pages.settings.heading`)}
                onClick={closeMenu}
              />
            </li>
            <li
              className={"advanced"}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Switch
                size="small"
                onChange={(checked) => {
                  handleAdvancedModeChange(checked);
                }}
                defaultChecked={advancedMode}
              />
              <span>
                {counterpart.translate(`field.labels.advanced_settings`)}
              </span>
            </li>
          </>
        )}

        {localStorageAccount && advancedMode ? (
          <>
            <li>
              <MenuItem
                href="/voting"
                icon={<Vote className={"menu-icon"} />}
                label={counterpart.translate(`pages.voting.heading`)}
                onClick={closeMenu}
              />
            </li>
          </>
        ) : (
          ""
        )}

        {!localStorageAccount ? (
          ""
        ) : (
          <li className={"logout"}>
            <MenuItem
              href="/logout"
              icon={<PoweroffOutlined className={"menu-icon"} />}
              label={counterpart.translate(`pages.logout.heading`)}
              onClick={closeMenu}
            />
          </li>
        )}
      </ul>
    </MenuCard>
  );
};
