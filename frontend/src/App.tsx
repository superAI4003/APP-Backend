import ControlPanel from "./layout/ControlPanel";
import ContentPanel from "./layout/ContentPanel";
 
function App() {
 
  return (
    <div className="bg-[#F9F9F9] w-full h-screen flex pt-10">
      <div className="w-1/5 h-full pl-4">
        <ControlPanel />
      </div>
      <div className="w-4/5 h-full p-4 ">
          <ContentPanel />
      </div>
    </div>
  );
}

export default App;
