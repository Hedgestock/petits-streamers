import fetch from 'node-fetch';

const defaultPost = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export async function post(
  url = "",
  data = {},
  options = {}
) {
  const response = await fetch(url, {
    ...defaultPost,
    ...options,
    body: JSON.stringify(data),
  });
  return response;
}

export function randomString(length: number, chars: string) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function listToMap(list: string[]) {
  let map: { [key: string]: string } = {};
  list.forEach((item) => {
    map[item] = "";
  });
  return map;
}

export function parseURL(url: string) {
  let [path, queryString] = url.split("?");
  let query: { [key: string]: string } = {};
  if (queryString) {
    queryString.split("&").forEach((param) => {
      query[param.split("=")[0]] = param.split("=")[1];
    });
  }
  return { path, query };
}
