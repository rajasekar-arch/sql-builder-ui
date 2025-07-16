import React, { useState, useMemo } from "react";

/**
 * Supported window function names.
 */
export type WindowFunction =
  | "ROW_NUMBER"
  | "RANK"
  | "DENSE_RANK"
  | "LAG"
  | "LEAD";

/** Order-by entry */
export interface OrderCol {
  col: string;
  dir: "ASC" | "DESC";
}

/** Optional props so the component can be re-used */
interface WindowFunctionBuilderProps {
  /** Columns available from the selected table / subquery */
  columns?: string[];
  /** Called whenever the generated SQL changes */
  onSqlChange?: (sql: string) => void;
  /** Alias to use (default derived from function) */
  alias?: string;
}

/** Utility: safe identifier (VERY light; replace with dialect-specific quoting if needed) */
const ident = (s: string) => s; // TODO: plug in dialect-aware quoting

const WindowFunctionBuilder: React.FC<WindowFunctionBuilderProps> = ({
  columns = ["EmployeeID", "Department", "Salary", "HireDate"],
  onSqlChange,
  alias,
}) => {
  const [selectedFunction, setSelectedFunction] =
    useState<WindowFunction>("ROW_NUMBER");
  const [partitionCols, setPartitionCols] = useState<string[]>([]);
  const [orderCols, setOrderCols] = useState<OrderCol[]>([]);

  // ---- LAG / LEAD args ----
  const [valueCol, setValueCol] = useState<string>(columns[0] ?? "");
  const [lagLeadOffset, setLagLeadOffset] = useState<number>(1);
  const [lagLeadDefault, setLagLeadDefault] = useState<string>("");

  // When columns list changes, ensure valueCol still valid
  React.useEffect(() => {
    if (!columns.includes(valueCol)) {
      setValueCol(columns[0] ?? "");
    }
  }, [columns]);

  // Partition multi-select handler
  const handlePartitionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setPartitionCols(selected);
  };

  // Order toggle: -> ASC -> DESC -> (remove)
  const toggleOrderCol = (col: string) => {
    setOrderCols((prev) => {
      const idx = prev.findIndex((c) => c.col === col);
      if (idx === -1) {
        return [...prev, { col, dir: "ASC" }];
      }
      const current = prev[idx];
      if (current.dir === "ASC") {
        const next = [...prev];
        next[idx] = { ...current, dir: "DESC" };
        return next;
      }
      // was DESC -> remove
      return prev.filter((c) => c.col !== col);
    });
  };

  // Build function call text
  const fnCall = useMemo(() => {
    switch (selectedFunction) {
      case "ROW_NUMBER":
      case "RANK":
      case "DENSE_RANK":
        return `${selectedFunction}()`;
      case "LAG":
      case "LEAD": {
        const expr = valueCol ? ident(valueCol) : "/*select column*/";
        const args: string[] = [expr];
        if (lagLeadOffset !== 1 && !Number.isNaN(lagLeadOffset)) {
          args.push(String(lagLeadOffset));
        }
        if (lagLeadDefault !== "") {
          // naive literal quoting; you may want to detect numeric
          const isNumeric = /^-?\d+(\.\d+)?$/.test(lagLeadDefault.trim());
          args.push(
            isNumeric
              ? lagLeadDefault.trim()
              : `'${lagLeadDefault.replace(/'/g, "''")}'`
          );
        }
        return `${selectedFunction}(${args.join(", ")})`;
      }
      default:
        return "";
    }
  }, [selectedFunction, valueCol, lagLeadOffset, lagLeadDefault]);

  // Build OVER() parts
  const overParts: string[] = [];
  if (partitionCols.length) {
    overParts.push(`PARTITION BY ${partitionCols.map(ident).join(", ")}`);
  }
  if (orderCols.length) {
    overParts.push(
      `ORDER BY ${orderCols.map((c) => `${ident(c.col)} ${c.dir}`).join(", ")}`
    );
  }
  const overClause = `OVER (${overParts.join(" ")})`;

  const finalAlias = alias ?? `${selectedFunction.toLowerCase()}_val`;
  const generatedSQL = `${fnCall} ${overClause} AS ${ident(finalAlias)}`;

  // Callback up to parent
  React.useEffect(() => {
    onSqlChange?.(generatedSQL);
  }, [generatedSQL, onSqlChange]);

  const copySQL = () => {
    navigator.clipboard.writeText(generatedSQL).catch(() => {});
  };

  // helper to know current order state for button label
  const orderState = (col: string): "none" | "ASC" | "DESC" => {
    const found = orderCols.find((c) => c.col === col);
    return found ? found.dir : "none";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto border rounded-lg shadow-md bg-white space-y-6">
      <h2 className="text-xl font-bold">Window Function Builder</h2>

      {/* Function */}
      <div>
        <label className="block mb-2 font-semibold">Select Function</label>
        <select
          value={selectedFunction}
          onChange={(e) =>
            setSelectedFunction(e.target.value as WindowFunction)
          }
          className="border p-2 w-full rounded"
        >
          <option value="ROW_NUMBER">ROW_NUMBER()</option>
          <option value="RANK">RANK()</option>
          <option value="DENSE_RANK">DENSE_RANK()</option>
          <option value="LAG">LAG()</option>
          <option value="LEAD">LEAD()</option>
        </select>
      </div>

      {/* Extra args for LAG/LEAD */}
      {(selectedFunction === "LAG" || selectedFunction === "LEAD") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Value Column</label>
            <select
              value={valueCol}
              onChange={(e) => setValueCol(e.target.value)}
              className="border p-2 w-full rounded"
            >
              {columns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">
              Offset (default 1)
            </label>
            <input
              type="number"
              min={0}
              value={lagLeadOffset}
              onChange={(e) => setLagLeadOffset(Number(e.target.value))}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">
              Default Value (optional)
            </label>
            <input
              type="text"
              value={lagLeadDefault}
              onChange={(e) => setLagLeadDefault(e.target.value)}
              placeholder="NULL"
              className="border p-2 w-full rounded"
            />
          </div>
        </div>
      )}

      {/* Partition */}
      <div>
        <label className="block mb-2 font-semibold">Partition By</label>
        <select
          multiple
          value={partitionCols}
          onChange={handlePartitionChange}
          className="border p-2 w-full rounded h-32"
        >
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
        {partitionCols.length > 0 && (
          <button
            type="button"
            onClick={() => setPartitionCols([])}
            className="mt-2 text-sm underline"
          >
            Clear Partition
          </button>
        )}
      </div>

      {/* Order */}
      <div>
        <label className="block mb-2 font-semibold">
          Order By (click to cycle ASC → DESC → Off)
        </label>
        <div className="flex flex-wrap gap-2">
          {columns.map((col) => {
            const state = orderState(col);
            const active = state !== "none";
            return (
              <button
                key={col}
                type="button"
                onClick={() => toggleOrderCol(col)}
                className={`px-3 py-1 border rounded transition-colors ${
                  !active
                    ? "bg-gray-100 text-gray-800"
                    : state === "ASC"
                    ? "bg-green-500 text-white"
                    : "bg-green-700 text-white"
                }`}
                title={
                  active
                    ? `Currently ${state}. Click to ${
                        state === "ASC" ? "DESC" : "remove"
                      }.`
                    : "Click to sort ASC."
                }
              >
                {col} {active ? `(${state})` : ""}
              </button>
            );
          })}
        </div>
        {orderCols.length > 0 && (
          <button
            type="button"
            onClick={() => setOrderCols([])}
            className="mt-2 text-sm underline"
          >
            Clear Order By
          </button>
        )}
      </div>

      {/* SQL Preview */}
      <div>
        <label className="block mb-1 font-semibold">Generated SQL</label>
        <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap break-all">
          {generatedSQL}
        </pre>
        <button
          onClick={copySQL}
          type="button"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Copy SQL
        </button>
      </div>
    </div>
  );
};

export default WindowFunctionBuilder;
