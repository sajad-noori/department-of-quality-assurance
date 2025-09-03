import React, { useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

const nodeWidth = 220;
const nodeHeight = 50;

const rawNodes = [
  { id: "1", data: { label: "رئیس تضمین کیفیت و اعتبار دهی (بست 2)" } },
  { id: "2", data: { label: "مدیر اجرائیه (بست 5)" } },
  { id: "3", data: { label: "خانه سامان (بست 7)" } },
  { id: "4", data: { label: "دریور (بست 7)" } },
  { id: "5", data: { label: "آمر تضمین کیفیت (بست 3)" } },
  { id: "6", data: { label: "مدیر عمومی معیار های برنامه های علمی (بست 4)" } },
  { id: "7", data: { label: "کارشناس انکشاف معیار های مراکز آموزشی (بست 4)" } },
  {
    id: "8",
    data: { label: "کارشناس انکشاف معیار های برنامه های علمی (بست 4)" },
  },
  { id: "9", data: { label: "مدیر عمومی تضمین کیفیت (بست 4)" } },
  { id: "10", data: { label: "کارشناس تضمین کیفیت برنامه های علمی (بست 4)" } },
  { id: "11", data: { label: "کارشناس تضمین کیفیت مراکز آموزشی (بست 4)" } },
  { id: "12", data: { label: "آمر اعتباردهی و تصدیق دهی (بست 3)" } },
  { id: "13", data: { label: "مدیر عمومی اعتبار دهی مراکز آموزشی (بست 4)" } },
  { id: "14", data: { label: "کارشناس اعتباردهی مراکز آموزشی (بست 4)" } },
  {
    id: "15",
    data: { label: "مدیر عمومی اعتبار دهی برنامه های آموزشی (بست 4)" },
  },
  { id: "16", data: { label: "کارشناس اعتبار دهی برنامه های آموزشی (بست 4)" } },
  { id: "17", data: { label: "کارکن خدماتی (بست 8)" } },
];

const edges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-4", source: "1", target: "4" },
  { id: "e1-5", source: "1", target: "5" },
  { id: "e1-12", source: "1", target: "12" },
  { id: "e1-17", source: "12", target: "17" },
  { id: "e5-6", source: "5", target: "6" },
  { id: "e6-7", source: "6", target: "7" },
  { id: "e6-8", source: "6", target: "8" },
  { id: "e5-9", source: "5", target: "9" },
  { id: "e9-10", source: "9", target: "10" },
  { id: "e9-11", source: "9", target: "11" },
  { id: "e12-13", source: "12", target: "13" },
  { id: "e13-14", source: "13", target: "14" },
  { id: "e12-15", source: "12", target: "15" },
  { id: "e15-16", source: "15", target: "16" },
];

// Dagre layout function
const getLayoutedNodes = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "TB",
    nodesep: 40,
    ranksep: 60,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 },
      draggable: true, // ✅ all nodes draggable
      className: "org-node",
    };
  });
};

function App() {
  const layoutedNodes = useMemo(() => getLayoutedNodes(rawNodes, edges), []);
  const [nodes, setNodes] = useNodesState(layoutedNodes);
  const [edgesState, setEdges] = useEdgesState(edges);

  return (
    <div className="org-chart" style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edgesState}
        nodesDraggable
        nodesConnectable={false}
        fitView
        onNodeDragStop={(event, node) => {
          // update node position individually
          setNodes((nds) =>
            nds.map((n) =>
              n.id === node.id ? { ...n, position: node.position } : n
            )
          );
        }}
      >
        <MiniMap className="org-minimap" />
        <Controls className="org-controls" />
        <Background color="var(--rf-grid-color)" gap={24} />
      </ReactFlow>

      <style>{`
        /* Container defaults: Dark mode baseline like Banner */
        .org-chart {
          background-color: #121212;
          color: #eee;
        }

        /* Light mode overrides using data-theme, same pattern as Banner */
        [data-theme="light"] .org-chart {
          background-color: #ffffff;
          color: #333333;
        }

        /* CSS variables to control React Flow theming */
        .org-chart {
          --rf-node-bg: #1e1e1e;
          --rf-node-text: #e6f7ff;
          --rf-node-border: #0dcaf0;
          --rf-node-shadow: rgba(13, 202, 240, 0.3);
          --rf-node-hover: #262a2e;
          --rf-edge-color: #53d6f3;
          --rf-controls-bg: rgba(255, 255, 255, 0.06);
          --rf-controls-border: rgba(255, 255, 255, 0.2);
          --rf-controls-icon: #0dcaf0;
          --rf-minimap-mask: rgba(13, 202, 240, 0.2);
          --rf-grid-color: rgba(255, 255, 255, 0.08);
        }

        [data-theme="light"] .org-chart {
          --rf-node-bg: #ffffff;
          --rf-node-text: #0b1f28;
          --rf-node-border: #0dcaf0;
          --rf-node-shadow: rgba(13, 202, 240, 0.25);
          --rf-node-hover: #f5fdff;
          --rf-edge-color: #00b5d7;
          --rf-controls-bg: rgba(0, 0, 0, 0.04);
          --rf-controls-border: rgba(0, 0, 0, 0.1);
          --rf-controls-icon: #00b5d7;
          --rf-minimap-mask: rgba(0, 181, 215, 0.2);
          --rf-grid-color: rgba(0, 0, 0, 0.08);
        }

        /* Node styling */
        .react-flow__node.org-node {
          background: var(--rf-node-bg);
          color: var(--rf-node-text);
          border: 2px solid var(--rf-node-border);
          border-radius: 10px;
          box-shadow: 0 4px 16px var(--rf-node-shadow);
          padding: 8px 10px;
          font-weight: 700;
          font-size: 0.95rem;
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          direction: rtl;
        }

        .react-flow__node.org-node:hover {
          transform: translateY(-2px);
          background: var(--rf-node-hover);
          box-shadow: 0 8px 20px var(--rf-node-shadow);
        }

        /* Edge styling */
        .react-flow__edge-path {
          stroke: var(--rf-edge-color) !important;
          stroke-width: 2px;
        }
        .react-flow__edge.animated .react-flow__edge-path {
          stroke-dasharray: 5 5;
        }

        /* Controls styling */
        .org-controls .react-flow__controls {
          background: var(--rf-controls-bg);
          border: 1px solid var(--rf-controls-border);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .org-controls .react-flow__controls-button {
          fill: var(--rf-controls-icon);
          color: var(--rf-controls-icon);
          border-bottom: 1px solid var(--rf-controls-border);
        }

        /* MiniMap styling */
        .org-minimap.react-flow__minimap svg {
          filter: drop-shadow(0 0 8px var(--rf-node-shadow));
        }
        .org-minimap .react-flow__minimap-mask {
          fill: var(--rf-minimap-mask);
        }

        /* Hide React Flow attribution if present */
        .react-flow__attribution {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default App;
