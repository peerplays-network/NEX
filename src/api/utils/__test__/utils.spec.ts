import { KeyboardEvent } from "react";

import { utils } from "../utils";

describe("Testing utils functions ", () => {
  describe("SortId function", () => {
    const a = "1.2.3";
    const b = "1.2.4";
    const c = "1.2.5";
    it("sortId should returns -1 for a = 1.2.3 and b = 1.2.4 in sortId(a,b)", () => {
      expect(utils.sortID(a, b)).toEqual(-1);
    });

    it("sortId should returns 1 for a = 1.2.3 and b = 1.2.4 in sortId(b,a)", () => {
      expect(utils.sortID(b, a)).toEqual(1);
    });

    it("sortId should returns -1 for b = 1.2.4 and c = 1.2.5 in sortId(b,c)", () => {
      expect(utils.sortID(b, c)).toEqual(-1);
    });

    it("sortId should returns -2 for a = 1.2.3 and c = 1.2.5 in sortId(a,c)", () => {
      expect(utils.sortID(a, c)).toEqual(-2);
    });

    it("sortId should returns 1 for a = 1.2.3 and b = 1.2.4 in sortId(a,b, inverse=true)", () => {
      expect(utils.sortID(a, b, true)).toEqual(1);
    });

    it("sortId should returns -1 for a = 1.2.3 and b = 1.2.4 in sortId(b,a, inverse=true)", () => {
      expect(utils.sortID(b, a, true)).toEqual(-1);
    });

    it("sortId should returns 1 for b = 1.2.4 and c = 1.2.5 in sortId(b,c, inverse=true)", () => {
      expect(utils.sortID(b, c, true)).toEqual(1);
    });

    it("sortId should returns 2 for a = 1.2.3 and c = 1.2.5 in sortId(a,c, inverse=true)", () => {
      expect(utils.sortID(a, c, true)).toEqual(2);
    });
  });

  describe("isObjectId function", () => {
    const accountObjectID = "1.2.3";
    const assetObjectID = "1.3.4";
    const witnessObjectID = "1.6.1";
    const invalidObjectID1 = "1.2";
    const invalidObjectID2 = "1.2.3.4";
    const invalidObjectID3 = "hello";
    const invalidObjectID4 = "1";
    const invalidObjectID5 = "";

    it("1.2.3 is a valid acoount object id", () => {
      expect(utils.isObjectId(accountObjectID)).toBe(true);
    });

    it("1.3.4 is a valid asset object id", () => {
      expect(utils.isObjectId(assetObjectID)).toBe(true);
    });

    it("1.6.1 is a valid witness object id", () => {
      expect(utils.isObjectId(witnessObjectID)).toBe(true);
    });

    it("1.2 is invalid object id", () => {
      expect(utils.isObjectId(invalidObjectID1)).toBe(false);
    });

    it("1.2.3.4 is an invalid object id", () => {
      expect(utils.isObjectId(invalidObjectID2)).toBe(false);
    });

    it("hello is an invalid object id", () => {
      expect(utils.isObjectId(invalidObjectID3)).toBe(false);
    });

    it("1 is an invalid object id", () => {
      expect(utils.isObjectId(invalidObjectID4)).toBe(false);
    });

    it("empty string is an invalid object id", () => {
      expect(utils.isObjectId(invalidObjectID5)).toBe(false);
    });
  });

  describe("trimNum function", () => {
    const num = 123.4567;
    const num1 = NaN;
    it("trimNum function should return 123.45 for trimNum(123.4567, 2)", () => {
      expect(utils.trimNum(num, 2)).toEqual(123.45);
    });
    it("trimNum function should return 123.456 for trimNum(123.4567, 3)", () => {
      expect(utils.trimNum(num, 3)).toEqual(123.456);
    });
    it("trimNum function should return 123.4567 for trimNum(123.4567, 4)", () => {
      expect(utils.trimNum(num, 4)).toEqual(123.4567);
    });
    it("trimNum function should return 0 for trimNum(Nan, any digit)", () => {
      expect(utils.trimNum(num1, 4)).toEqual(0);
    });
  });

  describe("isNumber function", () => {
    const numString1 = "1";
    const numString2 = "0";
    const numString3 = "h";
    const numString4 = " ";
    const numString5 = ".";

    it("1 is a number", () => {
      expect(utils.isNumber(numString1)).toBe(true);
    });

    it("0 is a number", () => {
      expect(utils.isNumber(numString2)).toBe(true);
    });

    it("h is not a number", () => {
      expect(utils.isNumber(numString3)).toBe(false);
    });

    it("epmty string is not a number", () => {
      expect(utils.isNumber(numString4)).toBe(false);
    });

    it("It is possible to use `.` in is number function", () => {
      expect(utils.isNumber(numString5)).toBe(true);
    });
  });

  describe("isNumberKey function (in respone to react keyboardEvent)", () => {
    it("should return true for number keys", () => {
      const e = {
        key: "1",
      };
      expect(utils.isNumberKey(e as KeyboardEvent<HTMLInputElement>)).toBe(
        true
      );
    });

    it("should return false for non-number keys", () => {
      const e = {
        key: "a",
      };
      expect(utils.isNumberKey(e as KeyboardEvent<HTMLInputElement>)).toBe(
        false
      );
    });
  });

  describe("ensureInputNumberValidity function", () => {
    describe("should prevent non-number keys from being entered", () => {
      beforeEach(() => {
        jest.spyOn(utils, "isNumberKey").mockReturnValue(false);
      });
      it("should prevent `a` from being entered", () => {
        const e = {
          preventDefault: jest.fn(),
          target: { value: "a" },
        };
        utils.ensureInputNumberValidity(e as any);
        expect(e.preventDefault).toHaveBeenCalled();
      });
    });

    describe("Should check number and prevent numbers with integers part longer than 6 char", () => {
      beforeEach(() => {
        jest.spyOn(utils, "isNumberKey").mockReturnValue(true);
      });
      it("should prevent 588888888.55555 from being entered", () => {
        const e = {
          preventDefault: jest.fn(),
          target: { value: "588888888.55555" },
        };
        utils.ensureInputNumberValidity(e as any);
        expect(e.preventDefault).toHaveBeenCalled();
      });

      it("should allow entering 5888.55555 ", () => {
        const e = {
          preventDefault: jest.fn(),
          target: { value: "5888.55555" },
        };
        utils.ensureInputNumberValidity(e as any);
        expect(e.preventDefault).not.toHaveBeenCalled();
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe("validatePeerplaysAccountName function", () => {
    it("should return true for valid Graphene account names", () => {
      expect(utils.validatePeerplaysAccountName("abc").isValid).toBe(true);
      expect(utils.validatePeerplaysAccountName("abcd1234").isValid).toBe(true);
      expect(utils.validatePeerplaysAccountName("ab-cd-12-34").isValid).toBe(
        true
      );
      expect(
        utils.validatePeerplaysAccountName(
          "abcdefghijklmnopqrstuvwxyz1234567890"
        ).isValid
      ).toBe(true);
    });

    it("Should return false for invalid Graphene account names", () => {
      expect(utils.validatePeerplaysAccountName("abc--").isValid).toBe(false);
      expect(utils.validatePeerplaysAccountName("abc--").isValid).toBe(false);
      expect(utils.validatePeerplaysAccountName("ab.cd.12.34").isValid).toBe(
        false
      );
    });
  });

  describe("isUrlsEqual function", () => {
    it("should return true for URLs that are equal ignoring trailing slashes and the protocol part of the URL", () => {
      expect(
        utils.isUrlsEqual("https://www.abc.com", "http://www.abc.com/")
      ).toBe(true);
      expect(
        utils.isUrlsEqual(
          "https://www.abc.com/path1/",
          "http://www.abc.com/path1"
        )
      ).toBe(true);
      expect(
        utils.isUrlsEqual(
          "https://www.abc.com/path1/path2/",
          "http://www.abc.com/path1/path2"
        )
      ).toBe(true);
    });
    it("should return false for URLs that are not equal ignoring trailing slashes and the protocol part of the URL", () => {
      expect(
        utils.isUrlsEqual("https://www.abcz.com", "http://www.abc.com/")
      ).toBe(false);
      expect(
        utils.isUrlsEqual(
          "https://www.abcz.com/path1/",
          "http://www.abc.com/path1"
        )
      ).toBe(false);
      expect(
        utils.isUrlsEqual(
          "https://www.abcz.com/path1/path2/",
          "http://www.abc.com/path1/path2"
        )
      ).toBe(false);
    });
  });

  describe("getBlockchainFromSymbol function", () => {
    it('the blockchain for "HIVE" is Hive', () => {
      expect(utils.getNativeBlockchainFromAssetSymbol("HIVE")).toBe("Hive");
    });
    it('the blockchain for "Hive" is Hive', () => {
      expect(utils.getNativeBlockchainFromAssetSymbol("Hive")).toBe("Hive");
    });
    it('the blockchain for the symbol "ETH" is Ethereum', () => {
      expect(utils.getNativeBlockchainFromAssetSymbol("ETH")).toBe("Ethereum");
    });
    it('the blockchain for the symbol "eth" is Ethereum', () => {
      expect(utils.getNativeBlockchainFromAssetSymbol("eth")).toBe("Ethereum");
    });
    it('the blockchain for the symbol "BTC" is Bitcoin', () => {
      expect(utils.getNativeBlockchainFromAssetSymbol("BTC")).toBe("Bitcoin");
    });
    it('the blockchain for the symbol "btc" is Bitcoin', () => {
      expect(utils.getNativeBlockchainFromAssetSymbol("btc")).toBe("Bitcoin");
    });
  });
});
