import Icon from "@ant-design/icons";
import { IconComponentProps } from "@ant-design/icons/lib/components/Icon";
import { RefAttributes } from "react";

const RedditSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 256 256"
    >
      <path
        fill="currentColor"
        d="M248 104a32 32 0 0 0-52.9-24.2c-16.8-8.9-36.8-14.3-57.7-15.5l5.2-31.2l21.8 3.4a24.2 24.2 0 1 0 2.5-15.8l-29.7-4.6a8 8 0 0 0-9.1 6.6l-6.9 41.5c-21.8.9-42.8 6.3-60.3 15.6a32 32 0 0 0-42.6 47.7A61.4 61.4 0 0 0 16 144c0 21.9 12 42.4 33.9 57.5S98.6 224 128 224s57.1-8 78.1-22.5S240 165.9 240 144a60.1 60.1 0 0 0-2.3-16.4A32.4 32.4 0 0 0 248 104ZM72 132a16 16 0 1 1 16 16a16 16 0 0 1-16-16Zm92.7 51.1a80.1 80.1 0 0 1-73.4 0a8 8 0 0 1 7.3-14.2a64.2 64.2 0 0 0 58.8 0a8 8 0 0 1 7.3 14.2ZM168 148a16 16 0 1 1 16-16a16 16 0 0 1-16 16Z"
      />
    </svg>
  );
};

const RedditFilledIcon = (
  props: JSX.IntrinsicAttributes &
    IconComponentProps &
    RefAttributes<HTMLSpanElement>
): JSX.Element => {
  return <Icon component={RedditSVG} {...props} />;
};

export default RedditFilledIcon;
