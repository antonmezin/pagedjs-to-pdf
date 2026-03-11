const React = require('react');
const ContentTable = require('./ContentTable.js');

const Page = ({ id, title, content, pageNumber, totalPages }) => {
  const renderContent = () => {
    switch (content.type) {
      case 'text':
        return (
          <div
            className="text-content"
            dangerouslySetInnerHTML={{ __html: content.data }}
          />
        );

      case 'table':
        return (
          <ContentTable
            caption={content.data.caption}
            headers={content.data.headers}
            rows={content.data.rows}
          />
        );

      case 'mixed':
        return (
          <div
            className="mixed-content"
            dangerouslySetInnerHTML={{ __html: content.data }}
          />
        );

      default:
        return <div className="error-content">Unbekannter Content-Typ: {content.type}</div>;
    }
  };

  return (
    <div id={id} className="page" style={{ page: 'content' }}>
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="page-content">
        {renderContent()}
      </div>

      {/* Page numbering handled by CSS @page rules - no footer needed */}
    </div>
  );
};

module.exports = Page;