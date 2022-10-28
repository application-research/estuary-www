// NOTE(jim): https://github.com/filecoin-project/go-data-transfer/blob/master/statuses.go
// Definitions

export const statusColors = {
  0: `var(--status-0)`,
  1: `var(--status-1)`,
  2: `var(--status-2)`,
  3: `var(--status-3)`,
  4: `var(--status-4)`,
  5: `var(--status-5)`,
  6: `var(--status-6)`,
  7: `var(--status-7)`,
  8: `var(--status-8)`,
  9: `var(--status-9)`,
  10: `var(--status-10)`,
  11: `var(--status-11)`,
  12: `var(--status-12)`,
  13: `var(--status-13)`,
  14: `var(--status-14)`,
  15: `var(--status-15)`,
  16: `var(--status-16)`,
};

// NOTE(jim)
// As discussed with Why, this salt is okay to expose to the client
// Normally we would never do this but we want the password to be hashed from the wire.
// And not server to server
export const salt = '$2a$08$r31MZDLMLVcHAUfrePT2H.';

// NOTE(jim)
// Cookie key
export const auth = 'ESTUARY_TOKEN';

// NOTE(jim)
// Valid username regex
export const regex = {
  // NOTE(jim): only characters and digits.
  username: /^[a-zA-Z0-9]{1,32}$/,
  // NOTE(jim): eight characters, at least one letter and one number.
  password: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
};

function getAPIHost(): string {
  if (process.env.ESTUARY_API) {
    return process.env.ESTUARY_API;
  }

  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://api.estuary.tech';
    default:
      return 'http://localhost:3004';
  }
}

export const api = {
  host: getAPIHost(),
};

export const gateway = "https://strn.pl";