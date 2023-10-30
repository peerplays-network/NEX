import Link from "next/link";

import { SON_ACCOUNT_NAME } from "../../../../api/params";

type Props = {
  infoString: string;
};

export const HIVEAndHBDDepositInfo = ({ infoString }: Props): JSX.Element => {
  const stringParts = infoString.split(",");

  const getUserLink = (userLink: string, key: number) => {
    const trimedUserLink = userLink.replace(/\s/g, "");
    const userName = trimedUserLink.substring(
      trimedUserLink.indexOf("=") + 1,
      trimedUserLink.lastIndexOf("]")
    );
    return (
      <i key={`user-${key}`}>
        <Link href={`/profile?tab=activities`}>{userName}</Link>
      </i>
    );
  };

  const getSonAccountLink = (key: number) => {
    return (
      <Link
        key={`son-${key}`}
        target="_blank"
        href={`https://hiveblockexplorer.com/@son-account`}
      >
        son-account
      </Link>
    );
  };

  return (
    <>
      {stringParts.map((stringPart, index) => {
        if (stringPart.includes("userlink")) {
          return getUserLink(stringPart, index);
        } else if (stringPart.includes(SON_ACCOUNT_NAME)) {
          return getSonAccountLink(index);
        } else {
          return <span key={`${stringPart}-${index}`}>{stringPart}</span>;
        }
      })}
    </>
  );
};
