import { useState } from 'react';
import CopyDownload from '../../components/copyDownload/copyDownload';


interface CTE {
  name: string;
  columns: string;
  body: string;
}

export default function CTEBuilder() {
  const [ctes, setCtes] = useState<CTE[]>([
    { name: 'cte1', columns: '', body: 'SELECT * FROM table1' },
  ]);
  const [finalQuery, setFinalQuery] = useState('SELECT * FROM cte1');

  const addCte = () => {
    setCtes([...ctes, { name: `cte${ctes.length + 1}`, columns: '', body: '' }]);
  };

  const updateCte = (index: number, field: keyof CTE, value: string) => {
    const updated = [...ctes];
    updated[index][field] = value;
    setCtes(updated);
  };

  const generateSQL = () => {
    const cteSQL = ctes
      .map(
        (cte) =>
          `${cte.name}${cte.columns ? `(${cte.columns})` : ''} AS (\n  ${cte.body}\n)`
      )
      .join(',\n');

    return `WITH\n${cteSQL}\n${finalQuery.endsWith(';') ? finalQuery : finalQuery + ';'}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🧠 CTE (Common Table Expression) Builder</h1>

      {ctes.map((cte, i) => (
        <div key={i} className="mb-6 border p-4 rounded bg-gray-50">
          <h2 className="font-semibold mb-2">CTE #{i + 1}</h2>
          <input
            className="border p-2 w-full mb-2"
            placeholder="CTE Name (e.g. recent_orders)"
            value={cte.name}
            onChange={(e) => updateCte(i, 'name', e.target.value)}
          />
          <input
            className="border p-2 w-full mb-2"
            placeholder="Columns (optional, e.g. id, date)"
            value={cte.columns}
            onChange={(e) => updateCte(i, 'columns', e.target.value)}
          />
          <textarea
            className="border p-2 w-full font-mono"
            rows={4}
            placeholder="SQL body (e.g. SELECT * FROM orders WHERE date > NOW() - INTERVAL '7 days')"
            value={cte.body}
            onChange={(e) => updateCte(i, 'body', e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={addCte}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        ➕ Add CTE
      </button>

      <h3 className="font-semibold mb-2">Final SELECT Query</h3>
      <textarea
        className="border p-2 w-full font-mono mb-6"
        rows={3}
        value={finalQuery}
        onChange={(e) => setFinalQuery(e.target.value)}
        placeholder="SELECT * FROM cte1"
      />

      <h2 className="text-lg font-semibold mt-6">Generated SQL</h2>
      <pre className="bg-gray-100 p-4 rounded border whitespace-pre-wrap">
        {generateSQL()}
      </pre>

      <CopyDownload sql={generateSQL()} />
    </div>
  );
}
