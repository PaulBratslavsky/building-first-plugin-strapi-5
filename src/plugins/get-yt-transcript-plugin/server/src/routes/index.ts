"use strict";

import contentApi from "./content-api";
import admin from "./admin";

export default {
  "content-api": {
    type: "content-api",
    routes: [...contentApi],
  },
  admin: {
    type: "admin",
    routes: [...admin],
  },
};