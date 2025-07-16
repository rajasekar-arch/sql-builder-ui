import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import DMLBuilder from "./pages/dml/dml";
import DclTclBuilder from "./pages/dcl-tcl/dcl-tcl";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import DDLBuilder from "./pages/ddl/ddl";
import FunctionsBuilder from "./pages/functions/functions";
import JoinsBuilder from "./pages/joins/joins";
import SchemaPage from "./pages/schema-visualizer/schema-visualizer";
import SubqueriesBuilder from "./pages/subqueries/subqueries";
import CTEBuilder from "./pages/cte/cte";
import ToasterProvider from "./components/ToasterProvider/ToasterProvider";
import WindowFunctionBuilder from "./pages/window-functions/window-functions";

function App() {
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <ToasterProvider />
        <Header />
        <main style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ddl" element={<DDLBuilder />} />
            <Route path="/dml" element={<DMLBuilder />} />
            <Route path="/dcl-tcl" element={<DclTclBuilder />} />
            <Route path="/functions" element={<FunctionsBuilder />} />
            <Route path="/joins" element={<JoinsBuilder />} />
            <Route path="/schema-visualizer" element={<SchemaPage />} />
            <Route path="/subqueries" element={<SubqueriesBuilder />} />
            <Route path="/cte" element={<CTEBuilder />} />
            <Route path="/window-functions" element={<WindowFunctionBuilder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
