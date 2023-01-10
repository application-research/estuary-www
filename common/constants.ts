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

function getMetricsHost(): string {
  if (process.env.NEXT_PUBLIC_ESTUARY_METRICS_API) {
    return process.env.NEXT_PUBLIC_ESTUARY_METRICS_API;
  }

  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://metrics-api.estuary.tech';
    default:
      return 'http://localhost:3030';
  }
}
function getAPIHost(): string {
  if (process.env.NEXT_PUBLIC_ESTUARY_API) {
    return process.env.NEXT_PUBLIC_ESTUARY_API;
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
  metricsHost: getMetricsHost(),
};

// get current date and 30 days before
var today = new Date();
var priorDateMonthly = new Date(new Date().setDate(today.getDate() - 30));
var priorDateWeekly = new Date(new Date().setDate(today.getDate() - 7));

// reformat date
var beforeMonthly = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
var afterMonthly = priorDateMonthly.getDate() + '-' + (priorDateMonthly.getMonth() + 1) + '-' + priorDateMonthly.getFullYear();

var beforeWeekly = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
var afterWeekly = priorDateWeekly.getDate() + '-' + (priorDateWeekly.getMonth() + 1) + '-' + priorDateMonthly.getFullYear();

export const staticEnvironmentPayload = {
  createdBefore: beforeWeekly,
  createdAfter: afterWeekly,
  uuids: [
    {
      Uuid: '766557e4-1c14-4bef-a5b2-d974bbb2d848',
      Name: 'Estuary API',
    },
    {
      Uuid: '60352064-7b2c-4597-baf6-9df128e9242b',
      Name: 'Shuttle-1',
    },
    {
      Uuid: 'ed16760d-ec36-4d71-b46f-378428c1d774',
      Name: 'Shuttle-2',
    },

    {
      Uuid: '266fbb9d-56a1-4dea-9b99-9f28054c5522',
      Name: 'Shuttle-4',
    },
    {
      Uuid: '20e7cd76-c65c-48a1-871e-39b692f051b3',
      Name: 'Shuttle-5',
    },
    {
      Uuid: '266fbb9d-56a1-4dea-9b99-9f28054c5522',
      Name: 'Shuttle-6',
    },
    {
      Uuid: '3c924716-f30e-4afd-a073-98204e4a96a7',
      Name: 'Shuttle-7',
    },
    {
      Uuid: '8ceea3cd-7608-4428-8d6b-99f2acc80ce3',
      Name: 'Shuttle-8',
    },
    {
      Uuid: '20e7cd76-c65c-48a1-871e-39b692f051b3',
      Name: '(NSQ) Queue Server',
    },
    {
      Uuid: 'a972ec78-d59a-47a4-b110-dd6c5dfc0e60',
      Name: 'DB Load Balancer',
    },
    {
      Uuid: 'ec7e5c3f-28e4-48ec-8df2-4630657bcc8e',
      Name: 'DB Server # 1',
    },
    {
      Uuid: '78e4e282-305f-4fde-9e89-3f58aed69c9c',
      Name: 'DB Server # 2',
    },
    {
      Uuid: 'fec7f5fb-a457-4d87-b334-c08584df1611',
      Name: 'DB Server # 3',
    },
    {
      Uuid: '43cfdfa5-6037-4520-9e4c-c46f4d3686a1',
      Name: 'Autoretrieve Server',
    },
    {
      Uuid: 'a8e5d22b-13ef-4dc9-adcf-a3b2bb4a8863',
      Name: 'Upload Proxy Server',
    },
    {
      Uuid: 'e4d0efb1-1b5b-4aaf-a6ed-37c4a6cc2c6f',
      Name: 'Backup Server',
    },
  ],
};
