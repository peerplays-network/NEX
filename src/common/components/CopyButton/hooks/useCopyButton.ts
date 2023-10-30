import { useCallback, useState } from "react";

import { copyText } from "../../../../api/utils";

import { UseCopyButtonResult } from "./useCopyButton.types";

export function useCopyButton(): UseCopyButtonResult {
  const [copied, setCopied] = useState<boolean>(false);

  const handleClick = useCallback(
    (value: string) => {
      setCopied(true);
      copyText(value);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    },
    [setCopied]
  );

  return {
    copied,
    handleClick,
  };
}
