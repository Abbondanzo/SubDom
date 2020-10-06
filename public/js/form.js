console.assert(Boolean(BASE_URL), "Global variable BASE_URL is not defined");

const SUBDOMAIN = document.getElementById("subdomain");
const SUBDOMAIN_PREVIEW = document.getElementById("subdomain-preview");
const SUBDOMAIN_BUTTON = document.getElementById("subdomain-submit");

const toSubdomain = (value) => {
  if (value === "") {
    return null;
  }
  const subdomains = value.toLowerCase().trim().split(" ");
  subdomains.push(BASE_URL.replace(/^https?:\/\//, "").toLowerCase());
  return subdomains.join(".");
};

SUBDOMAIN.addEventListener("input", (event) => {
  const { value } = event.target;
  const subdomain = toSubdomain(value);
  if (subdomain === null) {
    SUBDOMAIN_PREVIEW.innerHTML = "<i>None</i>";
    SUBDOMAIN_BUTTON.disabled = true;
  } else {
    SUBDOMAIN_PREVIEW.innerHTML = subdomain;
    SUBDOMAIN_BUTTON.disabled = false;
  }
});
