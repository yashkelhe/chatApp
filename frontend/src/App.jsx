import "./App.css";
import GetPromptAnswer from "./getAllprompt/getPromptAnswer";
import Prompt from "./prompt/prompt";
import SignIn from "./signUp/signIn";
import SignUp from "./signUp/signUp";

function App() {
  return (
    <>
      <div>
        <SignUp />
        <SignIn />
        <Prompt />
        <GetPromptAnswer />
      </div>
    </>
  );
}

export default App;
