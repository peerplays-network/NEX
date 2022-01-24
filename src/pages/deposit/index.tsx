import { Button } from "antd";
import type { NextPage } from "next";

import Deposit from "../../components/deposit";
import Layout from "../../components/layout";
import Styles from "../../styles/depositPage.module.scss";

const DepositPage: NextPage = () => {
  return (
    <Layout title="Deposit">
      <div className={Styles.headerContainer}>
        <div className={Styles.headerContainerItem}>
          <Button className={Styles.btn}>Deposit</Button>
          <Button className={Styles.btn}>Wtihdraw</Button>
          <Button className={Styles.btn}>Swap</Button>
          <Button className={Styles.btn}>Market</Button>
        </div>
      </div>
      <div className={Styles.bodyContainer}>
        <Deposit />
      </div>
    </Layout>
  );
};

export default DepositPage;
