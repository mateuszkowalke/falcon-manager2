import { list } from "@keystone-6/core";
import { text } from "@keystone-6/core/fields";

import { defaultAccess } from "../auth/auth";

export const Species = list({
  access: defaultAccess,

  fields: {
    name: text({ validation: { isRequired: true } }),
    latin: text({ validation: { isRequired: true } }),
  },

  graphql: {
      plural: "FalconSpecies"
  }
});
