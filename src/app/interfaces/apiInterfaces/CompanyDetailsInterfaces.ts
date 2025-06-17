export interface CompanyDetailsResponse {
  id: number;
  name: string;
  logo_path: string | null;
  description: string;
  headquarters: string;
  homepage: string;
  origin_country: string;
  parent_company: ParentCompany | null;
  images: CompanyImages;
}

export interface ParentCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface CompanyImages {
  logos: CompanyImagesI[];
}

export interface CompanyImagesI {
  aspect_ratio: number;
  file_path: string;
  height: number;
  file_type: string | null;
  vote_average: number;
  vote_count: number;
  width: number;
}
