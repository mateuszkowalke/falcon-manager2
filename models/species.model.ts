import { list } from "@keystone-6/core";
import { text } from "@keystone-6/core/fields";

import { sharedResourceAccess } from "../auth/auth";

export const Species = list({
  access: sharedResourceAccess,

  fields: {
    name: text({ validation: { isRequired: true } }),
    latin: text({ validation: { isRequired: true } }),
  },

  graphql: {
      plural: "FalconSpecies"
  }
});
