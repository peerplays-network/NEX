import { networkChain } from "../../api/params";

const commonColors = {
  errorColor: `#ff4d4f`,
  warningColor: `#f2c222`,
  infoColor: `#1890ff`,
  additionalBlue: `#1084FF`,
  linkColor: `#0A48BE`, // link color
  successColor: `#10AF77`,
  headingColor: `#212121`,
  textColor: `#212121`,
  textColorSecondary: `#6C6C6C`,
  textColorTertiary: `#B9B9B9`,
  approvedStatus: `#10AF77`,
  partiallyApprovedStatus: `#F5B041`,
  unapprovedStatus: `#D01721`,
  white: `#ffffff`,
  borderColorBase: `#C1C2C4`,
  successTag: `#B8F4C9`,
  assetTag: `#FDBA86`,
  missedColor: `#D01721`,
  inactiveColor: `#f0f0f0`,
  lightText: `#B9B9B9`,
  marketBuy: `#18A370`,
  marketSell: `#E2444D`,
  PeerPlaysBlue: `#0147BD`,
  PeerPlaysOrange: `#FB7A14`,
};

const chainColors = {
  mainnet: {
    primaryColor: `#0148BE`,
    primaryGradiantColor: `#01245f`,
    buttonColor: `#0148BE`,
    buttonHover: `#2369cc`,
  },
  testnet: {
    primaryColor: `#FB7A14`,
    primaryGradiantColor: `#C45A0A`,
    buttonColor: `#FB7A14`,
    buttonHover: `#CC6C23`,
  },
  devnet: {
    primaryColor: `#6402BF`,
    primaryGradiantColor: `#2c005e`,
    buttonColor: `#6402BF`,
    buttonHover: `#6423CC`,
  },
};

export const colors = {
  ...commonColors,
  ...chainColors[networkChain],
};
