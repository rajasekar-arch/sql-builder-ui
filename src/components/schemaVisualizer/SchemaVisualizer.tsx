
import { Node, Edge } from 'reactflow';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

interface SchemaVisualizerProps {
  nodes: Node[];
  edges: Edge[];
}

export default function SchemaVisualizer({ nodes, edges }: SchemaVisualizerProps) {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
