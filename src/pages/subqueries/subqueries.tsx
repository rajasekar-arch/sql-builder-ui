import { useState } from 'react';
import CopyDownload from '../../components/copyDownload/copyDownload';

export default function SubqueriesBuilder() {
  const [queryType, setQueryType] = useState('IN');
  const [mainTable, setMainTable] = useState('');
  const [mainColumn, setMainColumn] = useState('');
  const [subTable, setSubTable] = useState('');
  const [subColumn, setSubColumn] = useState('');
  const [subCondition, setSubCondition] = useState('');

  const generateSQL = () => {
    if (!mainTable || !mainColumn || !subTable || !subColumn) return '-- Fill all required fields';

    const subquery = `SELECT ${subColumn} FROM ${subTable}${subCondition ? ` WHERE ${subCondition}` : ''}`;

    switch (queryType) {
      case 'IN':
        return `SELECT * FROM ${mainTable} WHERE ${mainColumn} IN (${subquery});`;
      case 'EXISTS':
        return `SELECT * FROM ${mainTable} WHERE EXISTS (${subquery});`;
      case '=':
        return `SELECT * FROM ${mainTable} WHERE ${mainColumn} = (${subquery});`;
      default:
        return '-- Invalid query type';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔍 Subqueries Builder</h1>

      <div className="space-y-3 mb-6">
        <select
          className="border p-2 w-full"
          value={queryType}
          onChange={e => setQueryType(e.target.value)}
        >
          <option value="IN">IN</option>
          <option value="EXISTS">EXISTS</option>
          <option value="=">= (single value)</option>
        </select>

        <input className="border p-2 w-full" placeholder="Main Table" value={mainTable} onChange={e => setMainTable(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Column in Main Table" value={mainColumn} onChange={e => setMainColumn(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Subquery Table" value={subTable} onChange={e => setSubTable(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Column in Subquery" value={subColumn} onChange={e => setSubColumn(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Subquery Condition (optional)" value={subCondition} onChange={e => setSubCondition(e.target.value)} />
      </div>

      <h2 className="text-lg font-semibold mt-6">Generated SQL</h2>
      <pre className="bg-gray-100 p-4 rounded border whitespace-pre-wrap">{generateSQL()}</pre>

      <CopyDownload sql={generateSQL()} />
    </div>
  );
}
