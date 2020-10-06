console.assert(Boolean(BASE_URL), "Global variable BASE_URL is not defined");

/**
 * @type {HTMLHeadingElement}
 */
const SUBDOMAIN_PREVIEW = document.getElementById("subdomain-preview");
/**
 * Hidden input beneath the preview so we don't have to recompute.
 *
 * @type {HTMLInputElement}
 */
const ALIAS = document.getElementById("alias");

/**
 * ================================
 * Step 1
 * ================================
 */

/**
 * @type {HTMLInputElement}
 */
const ALIAS_INPUT = document.getElementById("alias-input");
/**
 * @type {HTMLSpanElement}
 */
const ALIAS_ERROR = document.getElementById("alias-error");
/**
 * @type {HTMLButtonElement}
 */
const ALIAS_SUBMIT = document.getElementById("alias-submit");
/**
 * @type {HTMLButtonElement}
 */
const ALIAS_EDIT = document.getElementById("alias-edit");

/**
 * Convert a string to a valid subdomain.
 *
 * @param {string} value
 * @returns {string}
 */
const toAlias = (value) => {
  return value
    .replace(/[^\w\s\-]+/g, "")
    .split(" ")
    .filter(Boolean)
    .join(".")
    .toLowerCase();
};

/**
 * Converts the given value to a subdomain and appends it to the base URL, defined globally.
 *
 * @param {string} value
 * @returns {string | null}
 */
const toSubdomain = (value) => {
  const alias = toAlias(value);
  if (alias === "") {
    return null;
  }
  return `${alias}.${removeProtocol(BASE_URL)}`;
};

/**
 * Updates subdomain preview and button based on input field.
 *
 * @param {string} value
 */
const handleAliasValue = (value) => {
  hideElement(ALIAS_ERROR);
  const subdomain = toSubdomain(value);
  setPreview(subdomain, false);
  ALIAS_SUBMIT.disabled = subdomain === null;
};

/**
 * Fires when a user clicks on the "Next" button.
 */
const onAliasSubmit = () => {
  const alias = toAlias(ALIAS_INPUT.value);
  ALIAS_SUBMIT.disabled = true;
  isAliasUsed(alias, (hasAlias, err) => {
    if (err) {
      onAliasSubmitError(err);
    } else if (hasAlias !== null) {
      if (hasAlias) {
        onAliasSubmitTaken();
      } else {
        onAliasSubmitAvailable(alias);
      }
    } else {
      console.error("Unhandled error occurred");
    }
  });
};

/**
 * Called when an exception is raised during alias submit request.
 *
 * @param {Object} err
 */
const onAliasSubmitError = (err) => {
  ALIAS_SUBMIT.disabled = true;
  ALIAS_ERROR.innerHTML = err.message
    ? err.message
    : "There was an error checking alias status";
  showElement(ALIAS_ERROR);
  console.error(err);
};

/**
 * Called when its discovered that the submitted alias is not in use.
 *
 * @param {string} alias
 */
const onAliasSubmitAvailable = (alias) => {
  ALIAS.value = alias;
  ALIAS_INPUT.disabled = true;
  hideElement(ALIAS_SUBMIT);
  showElement(ALIAS_EDIT);
  step2Setup();
};

/**
 * Called when its discovered that the submitted alias is in use.
 */
const onAliasSubmitTaken = () => {
  ALIAS_SUBMIT.disabled = true;
  ALIAS_ERROR.innerHTML = "This alias has been taken";
  showElement(ALIAS_ERROR);
};

/**
 * Fires when a user clicks on the "Edit" button.
 */
const onAliasEdit = () => {
  hideElement(ALIAS_EDIT);
  showElement(ALIAS_SUBMIT);
  ALIAS_INPUT.disabled = false;
  REDIRECT_SUBMIT.disabled = true;
};

// Subscribers
ALIAS_INPUT.addEventListener("input", (event) =>
  handleAliasValue(event.target.value)
);
ALIAS_SUBMIT.addEventListener("click", onAliasSubmit);
ALIAS_EDIT.addEventListener("click", onAliasEdit);

/**
 * ================================
 * Step 2
 * ================================
 */

/**
 * @type {HTMLDivElement}
 */
const FORM_STEP_2 = document.getElementById("form-step-2");
/**
 * @type {HTMLInputElement}
 */
const REDIRECT_INPUT = document.getElementById("redirect-input");
/**
 * @type {HTMLSpanElement}
 */
const REDIRECT_ERROR = document.getElementById("redirect-error");
/**
 * @type {HTMLButtonElement}
 */
const REDIRECT_SUBMIT = document.getElementById("redirect-submit");

/**
 *
 * @param {string} redirect
 */
const toValidRedirect = (redirect) => {
  redirect = removeProtocol(redirect);
  // 63: https://stackoverflow.com/questions/9238640/how-long-can-a-tld-possibly-be
  if (redirect.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,63}$/)) {
    return redirect;
  }
  return null;
};

const step2Setup = () => {
  showElement(FORM_STEP_2);
  REDIRECT_SUBMIT.disabled = !toValidRedirect(REDIRECT_INPUT.value);
};

const handleRedirectValue = (value) => {
  hideElement(REDIRECT_ERROR);
  const redirect = toValidRedirect(value);
  REDIRECT_SUBMIT.disabled = !redirect;
};

const onRedirectSubmit = () => {
  const alias = ALIAS.value;
  const redirect = toValidRedirect(REDIRECT_INPUT.value);
  REDIRECT_SUBMIT.disabled = true;
  saveRedirect(alias, redirect, (result, err) => {
    if (err) {
      onRedirectSubmitError(err);
    } else {
      console.log(result);
    }
  });
};

const onRedirectSubmitError = (err) => {
  REDIRECT_SUBMIT.disabled = true;
  REDIRECT_ERROR.innerHTML = err.message
    ? err.message
    : "There was an error checking alias status";
  showElement(REDIRECT_ERROR);
  console.error(err);
};

// Subscribers
REDIRECT_INPUT.addEventListener("input", (event) =>
  handleRedirectValue(event.target.value)
);
REDIRECT_SUBMIT.addEventListener("click", onRedirectSubmit);

/**
 * ================================
 * Utilities
 * ================================
 */

/**
 * Set the preview text beneath the title to the subdomain.
 *
 * If subdomain parameter is null, sets the text to italicized None
 * If subdomain is set but redirect is false, set the text to just the subdomain
 * If subdomain is set and redirect is true, set the text to a hyperlink of the subdomain.
 *
 * @param {string | null} subdomain
 * @param {boolean} redirect
 */
const setPreview = (subdomain, redirect) => {
  if (subdomain === null) {
    SUBDOMAIN_PREVIEW.innerHTML = "<i>None</i>";
  } else if (!redirect) {
    SUBDOMAIN_PREVIEW.innerHTML = subdomain;
  } else {
    SUBDOMAIN_PREVIEW.innerHTML = `<a href="${subdomain}" target="_blank">${subdomain}</a>`;
  }
};

/**
 * Removes HTTP/S protocol from a given url and returns it.
 *
 * @param {string} url
 * @returns {string}
 */
const removeProtocol = (url) => {
  return url.replace(/^https?:\/\//, "");
};

const hideElement = (element) => {
  element.classList.add("hidden");
};

const showElement = (element) => {
  element.classList.remove("hidden");
};

/**
 * ================================
 * First pass render
 * ================================
 */

/**
 *
 */
const init = () => {
  handleAliasValue("");
};

init();
