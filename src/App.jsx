import React, { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ReactFlowProvider } from 'reactflow';
import Toolbox from './components/Toolbox';
import Workbench from './components/Workbench';
import { useTable } from 'react-table';

function App() {
  const [objects, setObjects] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState({});

  const handleObjectDrop = (type, position) => {
    const newObject = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position,
      connections: [],
    };
    setObjects([...objects, newObject]);
  };

  const simulateDeviceBehavior = (type) => {
    switch (type) {
      case 'turbine':
        return { energyOutput: Math.floor(Math.random() * 100) + 1 };
      case 'battery':
        return { chargeLevel: Math.floor(Math.random() * 100) + 1 };
      case 'storage':
        return { storageCapacity: Math.floor(Math.random() * 500) + 100 };
      case 'server':
        return { cpuUsage: Math.floor(Math.random() * 100) + 1 };
      case 'cloud':
        return { uptime: `${Math.floor(Math.random() * 99) + 1}%` };
      default:
        return {};
    }
  };

  const handleSimulate = () => {
    setIsSimulating(true);

    const results = objects.reduce((acc, obj) => {
      acc[obj.id] = simulateDeviceBehavior(obj.type);
      return acc;
    }, {});

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResults(results);
    }, 2000);
  };

  const data = useMemo(() => {
    return objects.map((obj) => ({
      type: obj.type.charAt(0).toUpperCase() + obj.type.slice(1),
      ...simulationResults[obj.id],
    }));
  }, [objects, simulationResults]);

  const columns = useMemo(
    () => [
      {
        Header: 'Device Type',
        accessor: 'type',
      },
      {
        Header: 'Properties',
        columns: Object.keys(simulationResults[objects[0]?.id] || {}).map((key) => ({
          Header: key,
          accessor: key,
        })),
      },
    ],
    [simulationResults, objects]
  );

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className=" bg-gray-300 p-8">
      <div className="max-w-[1920px] mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Digital Twin Workbench</h1>
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Simulating...
              </>
            ) : (
              'Simulate'
            )}
          </button>
        </header>

        <div className="flex gap-6">
          <aside className="w-64 shrink-0">
            <Toolbox onDragStart={() => {}} />
          </aside>

          <main className="flex-1 h-[calc(100vh-12rem)]">
            <ReactFlowProvider>
              <Workbench objects={objects} onObjectDrop={handleObjectDrop} />
            </ReactFlowProvider>

            {!isSimulating && Object.keys(simulationResults).length > 0 && (
              <div className="mb-3 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800">Simulation Results</h2>
                <table {...getTableProps()} className="min-w-full border-collapse">
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps()}
                            className="border-b border-gray-300 p-4 text-left text-gray-600"
                          >
                            {column.render('Header')}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              className="border-b border-gray-300 p-4 text-gray-800"
                            >
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
