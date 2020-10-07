import { React } from "../../deps.ts";

interface Props {
  subdomain?: string;
  isSuccessful: boolean;
}

const Preview = ({ subdomain, isSuccessful }: Props) => {
  if (isSuccessful) {
    return <a href={subdomain}>{subdomain}</a>;
  }
  if (subdomain) {
    return <span>{subdomain}</span>;
  }
  return <i>None</i>;
};

const Header = ({ subdomain, isSuccessful }: Props) => {
  return (
    <>
      <h1 className="text-center">SubDom</h1>
      <div className="meta-info">
        {isSuccessful
          ? <h3 id="subdomain-current">
            Success! Your subdomain is:
          </h3>
          : <h4 id="subdomain-future">Your subdomain will be:</h4>}
        <h4 id="subdomain-preview">
          <Preview subdomain={subdomain} isSuccessful={isSuccessful} />
        </h4>
      </div>
    </>
  );
};

export default Header;
