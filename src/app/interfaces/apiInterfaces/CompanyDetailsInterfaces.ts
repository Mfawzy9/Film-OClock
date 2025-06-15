export interface CompanyDetailsResponse {
  id: number;
  name: string;
  logo_path: string | null;
  description: string;
  headquarters: string;
  homepage: string;
  origin_country: string;
  parent_company: ParentCompany | null;
}

export interface ParentCompany {
  id: number;
  name: string;
  logo_path: string | null;
}
