const React = require('react');

const TableOfContents = ({ sections }) => {
  return (
    <div className="toc-page" style={{ page: 'toc' }}>
      <div className="toc-header">
        <h1 className="toc-title">Inhaltsverzeichnis</h1>
      </div>

      <div className="toc-content">
        <nav className="toc-nav">
          {sections.map((section, index) => (
            <div key={section.id} className="toc-entry">
              <div className="toc-entry-content">
                <span className="toc-number">{index + 1}.</span>
                <a
                  href={`#${section.id}`}
                  className="toc-link"
                >
                  {section.title}
                </a>
                <span className="toc-dots"></span>
                <span className="toc-page-number" data-page-ref={section.id}>
                  {section.pageNumber}
                </span>
              </div>
            </div>
          ))}
        </nav>

        <div className="toc-footer">
          <p className="toc-info">
            Dieses Dokument enthält {sections.length} Hauptabschnitte.
          </p>
          <p className="toc-generated">
            Inhaltsverzeichnis automatisch generiert am {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  );
};

module.exports = TableOfContents;