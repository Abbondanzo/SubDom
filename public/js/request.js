console.assert(Boolean(BASE_URL), "Global variable BASE_URL is not defined");

const isAliasUsed = (alias, callback) => {
  fetch(`${BASE_URL}/api/check/${alias}`, {
    headers: { "content-type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then(({ hasAlias }) => callback(hasAlias))
    .catch(console.error);
};
