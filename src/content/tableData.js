// Additional table data that can be reused across components
export const tableStyles = {
  default: 'table-default',
  financial: 'table-financial',
  timeline: 'table-timeline',
  analysis: 'table-analysis'
};

export const commonHeaders = {
  quarterly: ['Quartal', 'Umsatz (€)', 'Gewinn (€)', 'Wachstum (%)'],
  regional: ['Region', 'Verkäufe', 'Veränderung', 'Anteil'],
  project: ['Projekt', 'Status', 'Fortschritt', 'Deadline'],
  team: ['Team', 'Mitarbeiter', 'Rolle', 'Standort']
};

// Helper function to format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

// Helper function to format percentages
export const formatPercentage = (value) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};