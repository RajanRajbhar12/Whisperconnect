import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import MoodSelection from "@/pages/mood-selection";
import Matching from "@/pages/matching";
import VoiceCall from "@/pages/voice-call";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/mood" component={MoodSelection} />
        <Route path="/matching/:mood" component={Matching} />
        <Route path="/call/:roomName/:mood" component={VoiceCall} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
