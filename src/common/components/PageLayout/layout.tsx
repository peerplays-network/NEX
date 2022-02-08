import { ConfigProvider } from "antd";
import Head from "next/head";
import React, { FunctionComponent, ReactNode, useEffect } from "react";

import * as Styled from "./layout.styled";
import TopBar from "./topBar/topBar";

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
  type?: string | undefined;
  heading?: string | undefined;
};

const Layout: FunctionComponent<Props> = ({
  children,
  title = "PeerPlays",
  description,
  type,
  heading,
}: Props) => {
  useEffect(() => {
    ConfigProvider.config({
      theme: {
        primaryColor: "#0148BE",
        errorColor: "#ff4d4f",
        warningColor: "#f2c222",
        successColor: "#2ADF5D",
        infoColor: "#1890ff",
      },
    });
  }, []);

  const getStyles = () => {
    switch (true) {
      case type == "card":
        return "card-layout";
      default:
        return "default";
    }
  };

  return (
    <>
      <Head>
        <title>{title} | PeerPlays</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopBar />
      <ConfigProvider>
        <Styled.Layout className={getStyles()}>
          {heading != undefined ? (
            <Styled.PageHeading className={"page-heading"}>
              {heading}
            </Styled.PageHeading>
          ) : (
            ""
          )}
          {children}
        </Styled.Layout>
      </ConfigProvider>
    </>
  );
};

export default Layout;
