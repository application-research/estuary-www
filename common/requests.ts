import Cookies from "js-cookie";

import * as C from "@common/constants";

export const get = async (route): Promise<any> => {
  try {
    const token = Cookies.get(C.auth);

    let r = await fetch(`${C.api.host}${route}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (r.status === 403) {
      return { error: "You are not authorized." };
    }

    const j = await r.json();
    if (!j) {
      return { error: "No response from the server." };
    }

    if (j.error) {
      return { error: j.error };
    }

    console.log(route, j);
    return j;
  } catch (e) {
    console.log(route, e);
    return { error: "Something went wrong on our end" };
  }
};

export const post = async (route, payload): Promise<any> => {
  try {
    const token = Cookies.get(C.auth);

    let r = await fetch(`${C.api.host}${route}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (r.status === 403) {
      return { error: "You are not authorized." };
    }

    const j = await r.json();
    if (!j) {
      return { error: "No response from the server." };
    }

    if (j.error) {
      return { error: j.error };
    }

    console.log(route, j);
    return j;
  } catch (e) {
    console.log(route, e);
    return { error: "Something went wrong on our end" };
  }
};

export const put = async (route, payload): Promise<any> => {
  try {
    const token = Cookies.get(C.auth);

    let r = await fetch(`${C.api.host}${route}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (r.status === 403) {
      return { error: "You are not authorized." };
    }

    const j = await r.json();
    if (!j) {
      return { error: "No response from the server." };
    }

    if (j.error) {
      return { error: j.error };
    }

    console.log(route, j);
    return j;
  } catch (e) {
    console.log(route, e);
    return { error: "Something went wrong on our end" };
  }
};

export const del = async (route: string, payload?: object): Promise<any> => {
  try {
    const token = Cookies.get(C.auth);

    let r = await fetch(`${C.api.host}${route}`, {
      method: "DELETE",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (r.status === 403) {
      return { error: "You are not authorized." };
    }

    const j = await r.json();
    if (!j) {
      return { error: "No response from the server." };
    }

    if (j.error) {
      return { error: j.error };
    }

    console.log(route, j);
    return j;
  } catch (e) {
    console.log(route, e);
    return { error: "Something went wrong on our end" };
  }
};
