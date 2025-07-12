import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{ padding: "10px", background: "#f0f0f0" }}>
      <nav>
        <Link to="/" style={{ margin: "0 10px" }}>
          Home
        </Link>
        <Link to="/ddl" style={{ margin: "0 10px" }}>
          DDL
        </Link>
        <Link to="/dcl-tcl" style={{ margin: "0 10px" }}>
          DCL-TCL
        </Link>
        <Link to="/dml" style={{ margin: "0 10px" }}>
          DML
        </Link>
        <Link to="/cte" style={{ margin: "0 10px" }}>
          CTE
        </Link>
        <Link to="/functions" style={{ margin: "0 10px" }}>
          Functions
        </Link>
        <Link to="/schema-visualizer" style={{ margin: "0 10px" }}>
          Schema-Visualizer
        </Link>
        <Link to="/cte" style={{ margin: "0 10px" }}>
          CTE
        </Link>
        <Link to="/subqueries" style={{ margin: "0 10px" }}>
          Functions
        </Link>
        <Link to="/joins" style={{ margin: "0 10px" }}>
          Joins
        </Link>
      </nav>
    </header>
  );
};

export default Header;
