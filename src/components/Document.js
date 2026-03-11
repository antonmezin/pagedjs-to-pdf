const React = require('react');
const TableOfContents = require('./TableOfContents.js');
const Page = require('./Page.js');

const Document = ({ contents, title = "Unternehmensbericht Q1 2024" }) => {
  // Extract sections for TOC generation
  const sections = contents.map((page, index) => ({
    id: page.id,
    title: page.title,
    pageNumber: index + 1
  }));

  return (
    <div className="document">
      {/* Document Title Page */}
      <div className="title-page" style={{ page: 'title' }}>
        <div className="title-content">
          <h1 className="document-title">{title}</h1>
          <div className="document-meta">
            <p className="generation-date">
              Erstellt am: {new Date().toLocaleDateString('de-DE')}
            </p>
            <p className="document-info">
              Automatisch generiert mit PagedJS und React
            </p>
          </div>
        </div>
      </div>

      {/* Page break before TOC */}
      <div className="page-break"></div>

      {/* Table of Contents */}
      <TableOfContents sections={sections} />

      {/* Page break before content */}
      <div className="page-break"></div>

      {/* Content Pages */}
      <div className="content-pages">
        {contents.map((pageContent, index) => (
          <React.Fragment key={pageContent.id}>
            <Page
              id={pageContent.id}
              title={pageContent.title}
              content={pageContent.content}
              pageNumber={index + 1}
              totalPages={contents.length}
            />
            {/* Add page break between pages (except after last page) */}
            {index < contents.length - 1 && <div className="page-break"></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

module.exports = Document;