import { useState } from "react";
import CopyDownload from '../../components/copyDownload/copyDownload';

interface Field {
  name: string;
  value: string;
}

export default function DMLBuilder() {
  const [type, setType] = useState("INSERT");
  const [table, setTable] = useState("");
  const [fields, setFields] = useState([{ name: "", value: "" }]);
  const [where, setWhere] = useState("");

  const addField = () => setFields([...fields, { name: "", value: "" }]);

  const updateField = <K extends keyof Field>(
    index: number,
    key: K,
    value: Field[K]
  ) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  const generateDML = () => {
    if (!table) return "-- Enter table name";

    const validFields = fields.filter((f) => f.name);
    const names = validFields.map((f) => f.name).join(", ");
    const values = validFields.map((f) => `'${f.value}'`).join(", ");

    if (type === "INSERT") {
      return `INSERT INTO ${table} (${names}) VALUES (${values});`;
    }

    if (type === "UPDATE") {
      const setClause = validFields
        .map((f) => `${f.name} = '${f.value}'`)
        .join(", ");
      return `UPDATE ${table} SET ${setClause}${
        where ? ` WHERE ${where}` : ""
      };`;
    }

    if (type === "DELETE") {
      return `DELETE FROM ${table}${where ? ` WHERE ${where}` : ""};`;
    }

    return "-- Invalid DML type";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        📋 DML Builder (INSERT / UPDATE / DELETE)
      </h1>

      <div className="mb-4 space-x-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border"
        >
          <option value="INSERT">INSERT</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          placeholder="Table Name"
          className="p-2 border"
          value={table}
          onChange={(e) => setTable(e.target.value)}
        />
      </div>

      {type !== "DELETE" && (
        <div className="space-y-2 mb-4">
          {fields.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="border p-2 w-1/2"
                placeholder="Column"
                value={f.name}
                onChange={(e) => updateField(i, "name", e.target.value)}
              />
              <input
                className="border p-2 w-1/2"
                placeholder="Value"
                value={f.value}
                onChange={(e) => updateField(i, "value", e.target.value)}
              />
            </div>
          ))}
          <button
            onClick={addField}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Field
          </button>
        </div>
      )}

      {type !== "INSERT" && (
        <input
          className="border p-2 w-full mb-4"
          placeholder="WHERE condition (optional)"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
        />
      )}

      <h2 className="text-lg font-semibold mt-6">Generated SQL</h2>
      <pre className="bg-gray-100 p-4 rounded border whitespace-pre-wrap">
        {generateDML()}
      </pre>

      <CopyDownload sql={generateDML()} />
    </div>
  );
}
