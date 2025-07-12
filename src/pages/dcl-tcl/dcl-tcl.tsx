import { useState } from "react";
import CopyDownload from '../../components/copyDownload/copyDownload';

export default function DclTclBuilder() {
  const [type, setType] = useState("GRANT");
  const [table, setTable] = useState("");
  const [user, setUser] = useState("");
  const [privilege, setPrivilege] = useState("SELECT");

  const generateSQL = () => {
    switch (type) {
      case "GRANT":
        return `GRANT ${privilege} ON ${table} TO '${user}';`;
      case "REVOKE":
        return `REVOKE ${privilege} ON ${table} FROM '${user}';`;
      case "COMMIT":
        return `COMMIT;`;
      case "ROLLBACK":
        return `ROLLBACK;`;
      case "SAVEPOINT":
        return `SAVEPOINT sp_${Date.now()};`;
      case "SET TRANSACTION":
        return `SET TRANSACTION READ ONLY;`;
      default:
        return "-- Invalid command";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔐 DCL & TCL Builder</h1>

      <select
        className="border p-2 w-full mb-4"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <optgroup label="DCL">
          <option value="GRANT">GRANT</option>
          <option value="REVOKE">REVOKE</option>
        </optgroup>
        <optgroup label="TCL">
          <option value="COMMIT">COMMIT</option>
          <option value="ROLLBACK">ROLLBACK</option>
          <option value="SAVEPOINT">SAVEPOINT</option>
          <option value="SET TRANSACTION">SET TRANSACTION</option>
        </optgroup>
      </select>

      {(type === "GRANT" || type === "REVOKE") && (
        <div className="space-y-3 mb-4">
          <input
            className="border p-2 w-full"
            placeholder="Table Name"
            value={table}
            onChange={(e) => setTable(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            placeholder="User Name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <select
            className="border p-2 w-full"
            value={privilege}
            onChange={(e) => setPrivilege(e.target.value)}
          >
            <option value="SELECT">SELECT</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="ALL PRIVILEGES">ALL PRIVILEGES</option>
          </select>
        </div>
      )}

      <h2 className="text-lg font-semibold mt-6">Generated SQL</h2>
      <pre className="bg-gray-100 p-4 rounded border whitespace-pre-wrap">
        {generateSQL()}
      </pre>

      <CopyDownload sql={generateSQL()} />
    </div>
  );
}
