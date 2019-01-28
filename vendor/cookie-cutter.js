// NOTE(jim): The simplest logic we can take for server side cookies
export const get = (headers, key) => {
  if (!headers.cookie) {
    return undefined;
  }

  var splat = headers.cookie.split(/;\s*/);
  for (var i = 0; i < splat.length; i++) {
    var ps = splat[i].split("=");
    var k = ps[0];
    if (k === key) return ps[1];
  }
  return undefined;
};
