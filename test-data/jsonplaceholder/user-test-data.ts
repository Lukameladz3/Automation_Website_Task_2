/**
 * Test data for JSONPlaceholder Users API
 */
export const UserTestData = {
  TOTAL_USERS_COUNT: 10,
  TEST_USER_ID: 5,

  USER_5: {
    ID: 5,
    NAME: "Chelsey Dietrich",
    USERNAME: "Kamren",
    EMAIL: "Lucio_Hettinger@annie.ca",
    ADDRESS: {
      STREET: "Skiles Walks",
      SUITE: "Suite 351",
      CITY: "Roscoeview",
      ZIPCODE: "33263",
      GEO: {
        LAT: "-31.8129",
        LNG: "62.5342",
      },
    },
    PHONE: "(254)954-1289",
    WEBSITE: "demarco.info",
    COMPANY: {
      NAME: "Keebler LLC",
      CATCH_PHRASE: "User-centric fault-tolerant solution",
      BS: "revolutionize end-to-end systems",
    },
  },

  GEO_RANGES: {
    LAT_MIN: -90,
    LAT_MAX: 90,
    LNG_MIN: -180,
    LNG_MAX: 180,
  },
} as const;
