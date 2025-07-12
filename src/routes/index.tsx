import { BrowserRouter, Route, Routes } from "react-router-dom";
import DclTclBuilder from "../pages/dcl-tcl/dcl-tcl";
import DDLBuilder from "../pages/ddl/ddl";
import DMLBuilder from "../pages/dml/dml";
import FunctionsBuilder from "../pages/functions/functions";
import JoinsBuilder from "../pages/joins/joins";
import SchemaPage from "../pages/schema-visualizer/schema-visualizer";
import SubqueriesBuilder from "../pages/subqueries/subqueries";
import Home from "../components/Home/Home";

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dcl-tcl" element={<DclTclBuilder />} />
      <Route path="/ddl" element={<DDLBuilder />} />
      <Route path="/dml" element={<DMLBuilder />} />
      <Route path="/functions" element={<FunctionsBuilder />} />
      <Route path="/joins" element={<JoinsBuilder />} />
      <Route path="/schema-visualizer" element={<SchemaPage />} />
      <Route path="/subqueries" element={<SubqueriesBuilder />} />
      {/* Add more routes here */}
    </Routes>
  </BrowserRouter>
);
