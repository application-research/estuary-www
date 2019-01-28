import bcrypt from "bcryptjs";

import * as U from "~/common/utilities";
import * as C from "~/common/constants";

export async function attemptHash(password) {
  if (U.isEmpty(password)) {
    return "";
  }

  const bcryptPromise = async () =>
    new Promise((resolve, reject) => {
      bcrypt.hash(password, C.salt, function (err, hash) {
        if (err) {
          console.log(err);
          return reject("");
        }

        return resolve(hash);
      });
    });

  var hash = await bcryptPromise();
  return hash;
}
