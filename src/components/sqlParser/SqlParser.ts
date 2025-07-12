export interface ParsedTable {
  name: string;
  columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean; references?: string }[];
}

export function parseSql(sql: string): ParsedTable[] {
  const tables: ParsedTable[] = [];

  const createTableRegex = /CREATE TABLE\s+(\w+)\s*\(([^;]+)\)/gi;
  const pkRegex = /PRIMARY KEY\s*\(([^)]+)\)/i;
  const fkRegex = /FOREIGN KEY\s*\(([^)]+)\)\s*REFERENCES\s+(\w+)\s*\(([^)]+)\)/i;

  let match;
  while ((match = createTableRegex.exec(sql)) !== null) {
    const [tableName, body] = match;
    const lines = body.split(',').map(line => line.trim());

    const columns: ParsedTable['columns'] = [];

    for (const line of lines) {
      if (line.toUpperCase().startsWith('PRIMARY KEY')) {
        const pkMatch = pkRegex.exec(line);
        if (pkMatch) {
          const keys = pkMatch[1].split(',').map(k => k.trim());
          keys.forEach(key => {
            const col = columns.find(c => c.name === key);
            if (col) col.isPrimary = true;
          });
        }
        continue;
      }

      const fkMatch = fkRegex.exec(line);
      if (fkMatch) {
        const col = fkMatch[1].trim();
        const refTable = fkMatch[2].trim();
        columns.push({
          name: col,
          type: 'FK',
          isForeign: true,
          references: `${refTable}`,
        });
        continue;
      }

      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        columns.push({ name: parts[0], type: parts[1] });
      }
    }

    tables.push({ name: tableName, columns });
  }

  return tables;
}
