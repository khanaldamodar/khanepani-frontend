import React from "react";

interface TableProps {
  headings: string[];
  data: Record<string, any>[];
  actions?: (row: Record<string, any>) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headings, data, actions }) => {
  return (
    <div className="overflow-x-auto rounded shadow font-poppins">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-blue-500 ">
          <tr>
            {headings.map((heading, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider"
              >
                {heading}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headings.length + (actions ? 1 : 0)}
                className="text-center py-6 text-gray-500"
              >
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headings.map((heading, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap"
                  >
                    {row[heading.toLowerCase().replace(/\s+/g, "_")]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-2 whitespace-nowrap">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
