import { FilecoinNumber } from '@glif/filecoin-number';

import * as C from '@common/constants';
import * as R from '@common/requests';
import * as Cookies from '@vendor/cookie-cutter';

export const formatEstuaryRetrievalUrl = (cid: string) => {
  return `${C.api.host}/gw/ipfs/${cid}`
}

export const formatDwebRetrievalUrl = (cid: string) => {
  return `https://dweb.link/ipfs/${cid}`
}

export const nanoToHours = (number: any): string => {
  const ms = Number(number) / 1000000;
  return (Number(ms) / (1000 * 60 * 60)).toFixed(1);
};

export const formatNumber = (number: any): string => {
  return Number(number).toLocaleString();
};

export const formatBoolean = (bool: boolean): string => {
  return bool ? `Yes` : `No`;
}

export const pad = (num: number, size: number): any => {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
};

export const toDateSinceEpoch = (epoch) => {
  const d = new Date(1000 * (epoch * 30 + 1598306400));
  return toDate(d);
};

export const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const pluralize = (text, count) => {
  return count > 1 || count === 0 ? `${text}s` : text;
};

export const isValidUsername = (username) => {
  return C.regex.username.test(username);
};

export const isValidPassword = (password) => {
  return C.regex.password.test(password);
};

export function debounce(func, timeout = 600) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function formatAsFilecoin(number) {
  return `${number} FIL`;
}

export function convertFIL(number = 0) {
  const filecoinNumber = new FilecoinNumber(`${number}`, 'attofil');
  const inFil = filecoinNumber.toFil();
  return inFil;
}

export function inFIL(number = 0) {
  const filecoinNumber = new FilecoinNumber(`${number}`, 'attofil');
  const inFil = filecoinNumber.toFil();

  let candidate = `${formatAsFilecoin(inFil)}`;

  return candidate;
}

export function inUSDPrice(number = 0, price = 0) {
  const filecoinNumber = new FilecoinNumber(`${number}`, 'attofil');
  const inFil = filecoinNumber.toFil();

  if (!isEmpty(price)) {
    let usd = Number(inFil) * Number(price);
    let copy = `$0.00 USD`;

    if (number > 0) {
      copy = `~$${usd.toFixed(2)} USD`;
    }

    if (usd >= 0.0000001) {
      copy = `$${usd.toFixed(7)} USD`;
    }

    return `${formatAsFilecoin(inFil)} ⇄ ${copy}`;
  }

  return `${formatAsFilecoin(inFil)}`;
}

export const getViewerFromFission = async ({ fs, path }) => {
  const maybePathExists = await fs.exists(path);

  if (!maybePathExists) {
    const newKey = await R.post(`/user/api-keys`, {});
    const newToken = await fs.write(path, newKey);
    await fs.publish(path, '');
  }

  const token = await fs.read(path);
  if (!token) {
    return null;
  }

  const viewer = await getViewerFromToken(token);

  return viewer;
};

export const getViewerFromToken = async (token) => {
  try {
    const url = `${C.api.host}/viewer`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();

    if (!json) {
      return null;
    }

    if (json.error) {
      return null;
    }

    return json;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getViewerFromHeader = async (headers) => {
  try {
    const token = Cookies.get(headers, C.auth);
    const url = `${C.api.host}/viewer`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();

    if (!json) {
      return null;
    }

    if (json.error) {
      return null;
    }

    return json;
  } catch (e) {
    return null;
  }
};

export const toDate = (data) => {
  const date = new Date(data);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const bytesToSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`;
};

export const isEmpty = (string) => {
  // NOTE(jim): If a number gets passed in, it isn't considered empty for zero.
  if (string === 0) {
    return false;
  }

  if (!string) {
    return true;
  }

  if (typeof string === 'object') {
    return true;
  }

  if (string.length === 0) {
    return true;
  }

  string = string.toString();

  return !string.trim();
};

const hasOwn = {}.hasOwnProperty;

export function classNames(...args: any[]) {
  var classes = [];

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!arg) continue;

    var argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        var inner = classNames.apply(null, arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === 'object') {
      if (arg.toString !== Object.prototype.toString) {
        classes.push(arg.toString());
      } else {
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      }
    }
  }

  return classes.join(' ');
}

export function getDealStateMessage(deal, transfer, chain) {
  const isOnChain = deal.dealId > 0;

  let message = `DealOnChain`;
  if (transfer && transfer.statusMessage) {
    if (!deal.dealId) {
      message = transfer.statusMessage;

      if (message === 'Completed') {
        message = 'TransferFinish';
      }
    }

    if (chain && chain.sectorStartEpoch && Number(chain.sectorStartEpoch) > 0) {
      message = `ActiveOnChain`;
    }
  }

  if (deal && deal.failed) {
    message = 'Failed';

    if (transfer && transfer.status === 6) {
      message = 'FailedAfterTransfer';
    }
  }

  if (deal && deal.onChainAt === `0001-01-01T00:00:00Z` && message === `DealOnChain`) {
    message = 'BrokenShuttle';
  }

  return message;
}
