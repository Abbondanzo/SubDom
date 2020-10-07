import { React } from "../../deps.ts";
import Header from "./Header.tsx";

interface Props {
  baseUrl: string;
  isServer: boolean;
}

const App = ({ baseUrl, isServer }: Props) => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="container">
      <div className="contents">
        <Header subdomain={"abc"} isSuccessful={false} />
        <button onClick={() => setCount(count + 1)}>Click the 🦕</button>
        <p>You clicked the 🦕 {count} times</p>
      </div>
    </div>
  );
};

export default App;
