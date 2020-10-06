console.assert(Boolean(BASE_URL), "Global variable BASE_URL is not defined");

const SUBDOMAIN = document.getElementById("subdomain");
const SUBDOMAIN_PREVIEW = document.getElementById("subdomain-preview");
const SUBDOMAIN_BUTTON = document.getElementById("subdomain-submit");

const toAlias = (value) => {
  return value.toLowerCase().trim().split(" ").join(".");
};

const toSubdomain = (value) => {
  if (value === "") {
    return null;
  }
  const alias = toAlias(value);
  return `${alias}.${BASE_URL.replace(/^https?:\/\//, "").toLowerCase()}`;
};

const handleSubdomainValue = (value) => {
  const subdomain = toSubdomain(value);
  if (subdomain === null) {
    SUBDOMAIN_PREVIEW.innerHTML = "<i>None</i>";
    SUBDOMAIN_BUTTON.disabled = true;
  } else {
    SUBDOMAIN_PREVIEW.innerHTML = subdomain;
    SUBDOMAIN_BUTTON.disabled = false;
  }
};

const onSubdomainSubmit = () => {
  const alias = toAlias(SUBDOMAIN.value);
  isAliasUsed(alias, (hasAlias) => {
    console.log(hasAlias);
  });
};

SUBDOMAIN.addEventListener("input", (event) =>
  handleSubdomainValue(event.target.value)
);
SUBDOMAIN_BUTTON.addEventListener("click", onSubdomainSubmit);
