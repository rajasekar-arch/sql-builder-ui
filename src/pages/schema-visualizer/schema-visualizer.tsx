import { useState } from 'react';

import { Node, Edge } from 'reactflow';
import { parseSql } from '../../components/sqlParser/SqlParser';
import SchemaVisualizer from '../../components/schemaVisualizer/SchemaVisualizer';

export default function SchemaPage() {
  const [sql, setSql] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleParse = () => {
    const tables = parseSql(sql);
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];

    tables.forEach((table, i) => {
      const colList = table.columns.map(c => {
        const flag = c.isPrimary ? ' (PK)' : c.isForeign ? ' (FK)' : '';
        return `${c.name} ${c.type}${flag}`;
      }).join('\n');

      generatedNodes.push({
        id: table.name,
        data: { label: `${table.name}\n———\n${colList}` },
        position: { x: i * 300, y: 100 },
      });

      table.columns.forEach(col => {
        if (col.isForeign && col.references) {
          generatedEdges.push({
            id: `${table.name}-${col.name}`,
            source: table.name,
            target: col.references,
            label: `${col.name} → ${col.references}`,
            animated: true,
          });
        }
      });
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setSql(content);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📊 Dynamic Schema Visualizer</h1>

      <textarea
        placeholder="Paste CREATE TABLE SQL here"
        className="border p-3 w-full h-40 mb-2 font-mono"
        value={sql}
        onChange={e => setSql(e.target.value)}
      />
      <div className="flex items-center gap-3 mb-4">
        <input type="file" accept=".sql,.txt" onChange={handleFile} className="border p-2" />
        <button onClick={handleParse} className="bg-blue-600 text-white px-4 py-2 rounded">🧠 Parse SQL</button>
      </div>

      {nodes.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">Schema Output</h2>
          <SchemaVisualizer nodes={nodes} edges={edges} />
        </>
      )}
    </div>
  );
}

