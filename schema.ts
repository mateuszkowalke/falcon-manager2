import type { Lists } from ".keystone/types";

import { User } from "./models/user.model";
import { BreedingProject } from "./models/breeding-project.model";
import { Aviary } from "./models/aviary.model";
import { Address } from "./models/address.model";
import { Falcon } from "./models/falcon.model";
import { Pair } from "./models/pair.model";

export const lists: Lists = {
    User,
    BreedingProject,
    Aviary,
    Address,
    Falcon,
    Pair
};
