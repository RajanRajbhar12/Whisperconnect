import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import MoodSelection from "@/pages/mood-selection";
import Matching from "@/pages/matching";
import VoiceCall from "@/pages/voice-call";
import NotFound from "@/pages/not-found";
import Premium from "@/pages/premium";
import Discover from "@/pages/discover";
import About from "@/pages/about";
import Help from "@/pages/help";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Switch>
        {/* Core Experience */}
        <Route path="/" component={Home} />
        <Route path="/mood" component={MoodSelection} />
        <Route path="/matching/:mood" component={Matching} />
        <Route path="/call" component={VoiceCall} />
        
        {/* Premium & Features */}
        
        <Route path="/discover" component={Discover} />
        
        {/* Company & Support */}
        <Route path="/about" component={About} />
        <Route path="/help" component={Help} />
        
        {/* 404 Page */}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
