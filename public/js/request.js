console.assert(Boolean(BASE_URL), "Global variable BASE_URL is not defined");

/**
 * Callback type signature for isAliasUsed.
 *
 * @callback isAliasUsedCallback
 * @param {boolean | null} hasAlias
 * @param {any} error
 */

/**
 * Perform a request to check if the given alias is used.
 *
 * @param {string} alias
 * @param {isAliasUsedCallback} callback
 */
const isAliasUsed = (alias, callback) => {
  if (alias === "") {
    callback(null, new Error("Cannot use empty string as alias"));
    return;
  }
  fetch(`${BASE_URL}/api/check/${alias}`, {
    headers: { "content-type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then(({ hasAlias }) => callback(hasAlias))
    .catch((err) => callback(null, err));
};

/**
 * Callback type signature for isAliasUsed.
 *
 * @callback saveRedirectCallback
 * @param {any} result
 * @param {any} error
 */

/**
 * Perform a request to save the current alias/redirect configuration.
 *
 * @param {string} alias
 * @param {string} redirect
 * @param {saveRedirectCallback} callback
 */
const saveRedirect = (alias, redirect, callback) => {
  if (alias === "") {
    callback(null, new Error("Cannot use empty string as alias"));
    return;
  }
  fetch(`${BASE_URL}/api/submit`, {
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ alias, redirect }),
    method: "POST",
  })
    .then(async (response) => {
      const body = await response.json();
      if (response.ok) {
        return body;
      } else {
        throw body;
      }
    })
    .then((response) => callback(response))
    .catch((err) => callback(null, err));
};
