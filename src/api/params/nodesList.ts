import counterpart from "counterpart";

import { Node } from "../../common/types";

import { testnetCheck } from "./networkParams";

export const nodeRegions = [
  // region of the node follows roughly https://en.wikipedia.org/wiki/Subregion#/media/File:United_Nations_geographical_subregions.png
  "Northern Europe",
  "Western Europe",
  "Southern Europe",
  "Eastern Europe",
  "Northern Asia",
  "Western Asia",
  "Southern Asia",
  "Eastern Asia",
  "Central Asia",
  "Southeastern Asia",
  "Australia and New Zealand",
  "Melanesia",
  "Polynesia",
  "Micronesia",
  "Northern Africa",
  "Western Africa",
  "Middle Africa",
  "Eastern Africa",
  "Southern Africa",
  "Northern America",
  "Central America",
  "Caribbean",
  "South America",
];

// node location could be the city name

export const testnetNodes: Node[] = [
  {
    url: "wss://fake.automatic-selection.com",
    location: counterpart.translate("settings.api_closest"),
  },
  {
    url: "wss://alphanet.peerplays.download/api",
    location: "",
    region: "Northern America",
    country: "Canada",
    user: {
      name: "Peerplays Witnesses",
      status: "Witness",
    },
  },
];

export const prodNodes: Node[] = [
  {
    url: "wss://fake.automatic-selection.com",
    location: counterpart.translate("settings.api_closest"),
  },
  {
    url: "wss://ca.peerplays.info",
    location: "",
    region: "Northern America",
    country: "Canada",
    user: {
      name: "Peerplays Witnesses",
      status: "Witness",
    },
  },
  {
    url: "wss://de.peerplays.xyz",
    location: "",
    region: "Western Europe",
    country: "Germany",
    user: {
      name: "Peerplays Witnesses",
      status: "Witness",
    },
  },
  {
    url: "wss://pl.peerplays.org",
    location: "",
    region: "Eastern Europe",
    country: "Poland",
    user: {
      name: "Peerplays Witnesses",
      status: "Witness",
    },
  },
];

export const automaticSelection = "wss://fake.automatic-selection.com";

export const defaultNodesList = testnetCheck ? testnetNodes : prodNodes;
