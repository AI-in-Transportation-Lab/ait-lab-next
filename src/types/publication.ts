export interface ResearchPaper {
  title: string;
  authors?: string;
  total_citations: number | string;
  year: number;
  url: string;
  publication_date?: string;
  journal?: string;
  publisher?: string;
  source?: string;
  source_url?: string;
  description?: string;
  issue?: string;
  book?: string;
  img?: string;
  pdf_link?: string;
  date_added: string;
  report_number?: string;
}

export interface ImpactFactor {
  journal: string;
  impact_factor: number;
  abbr: string;
}

export interface ImpactFactorTableData {
  id: number;
  journal: string;
  impact_factor: number;
  abbr: string;
  total: number;
  [key: number]: number;
}