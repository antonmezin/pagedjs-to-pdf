const React = require('react');

const ContentTable = ({ caption, headers, rows, className = '' }) => {
  return (
    <div className={`table-container ${className}`}>
      <table className="content-table">
        {caption && (
          <caption className="table-caption">
            {caption}
          </caption>
        )}

        <thead className="table-header">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="table-header-cell">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="table-body">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="table-cell">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table footer with row count */}
      <div className="table-footer">
        <small className="table-meta">
          {rows.length} {rows.length === 1 ? 'Eintrag' : 'Einträge'}
        </small>
      </div>
    </div>
  );
};

module.exports = ContentTable;