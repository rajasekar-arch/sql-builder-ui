import { useState } from 'react';
import CopyDownload from '../../components/copyDownload/copyDownload';

// Define join type
interface JoinClause {
  type: 'INNER JOIN' | 'LEFT JOIN' | 'RIGHT JOIN' | 'FULL JOIN';
  table: string;
  on: string;
}

export default function JoinsBuilder() {
  const [mainTable, setMainTable] = useState('');
  const [columns, setColumns] = useState<string[]>(['*']);
  const [joins, setJoins] = useState<JoinClause[]>([
    { type: 'INNER JOIN', table: '', on: '' }
  ]);
  const [where, setWhere] = useState('');

  const addJoin = () => {
    setJoins([...joins, { type: 'INNER JOIN', table: '', on: '' }]);
  };

  // ✅ Type-safe join updater
  const updateJoin = <K extends keyof JoinClause>(i: number, key: K, value: JoinClause[K]) => {
    const updated = [...joins];
    updated[i] = { ...updated[i], [key]: value };
    setJoins(updated);
  };

  const generateSQL = () => {
    if (!mainTable) return '-- Please enter a main table name';

    const joinClause = joins
      .filter(j => j.table && j.on)
      .map(j => `${j.type} ${j.table} ON ${j.on}`)
      .join('\n');

    const columnList = columns.filter(Boolean).join(', ') || '*';
    const whereClause = where ? `\nWHERE ${where}` : '';

    return `SELECT ${columnList}\nFROM ${mainTable}\n${joinClause}${whereClause};`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔗 Join Query Builder</h1>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Main Table (e.g., users)"
        value={mainTable}
        onChange={e => setMainTable(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Columns (comma separated, e.g., users.id, orders.total)"
        value={columns.join(', ')}
        onChange={e => setColumns(e.target.value.split(',').map(s => s.trim()))}
      />

      <h3 className="font-semibold mb-2">Joins</h3>
      {joins.map((j, i) => (
        <div key={i} className="mb-3 flex flex-col md:flex-row gap-2">
          <select
            className="p-2 border"
            value={j.type}
            onChange={e => updateJoin(i, 'type', e.target.value as JoinClause['type'])}
          >
            <option value="INNER JOIN">INNER JOIN</option>
            <option value="LEFT JOIN">LEFT JOIN</option>
            <option value="RIGHT JOIN">RIGHT JOIN</option>
            <option value="FULL JOIN">FULL JOIN</option>
          </select>
          <input
            className="p-2 border flex-1"
            placeholder="Table to Join"
            value={j.table}
            onChange={e => updateJoin(i, 'table', e.target.value)}
          />
          <input
            className="p-2 border flex-1"
            placeholder="ON condition (e.g., users.id = orders.user_id)"
            value={j.on}
            onChange={e => updateJoin(i, 'on', e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={addJoin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Add Join
      </button>

      <input
        className="border p-2 w-full mt-4"
        placeholder="WHERE condition (optional)"
        value={where}
        onChange={e => setWhere(e.target.value)}
      />

      <h2 className="text-lg font-semibold mt-6">Generated SQL</h2>
      <pre className="bg-gray-100 p-4 rounded border whitespace-pre-wrap">
        {generateSQL()}
      </pre>

      <CopyDownload sql={generateSQL()} />
    </div>
  );
}
