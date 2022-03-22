export type Membership = {
  isLifetimeMember: boolean;
  feesPaid: number;

  allocation: {
    network: {
      percent: number;
    };
    reviewer: {
      user: any;
      percent: number;
    };
    registrar: {
      user: any;
      percent: number;
    };
    referrer: {
      user: any;
      percent: number;
    };
    expiration: any;
  };
};
