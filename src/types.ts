export type DataSource = "API" | "cache";

export type VerificationStatus =
  | "idle"
  | "loading"
  | "found"
  | "not_found"
  | "error";

export interface CompanyData {
  ico: string;
  name: string;
  legalForm: string;
  legalFormCode: string;
  establishedDate: string | null;
  dissolvedDate: string | null;
  status: string;
  address: string;
  dic: string | null;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface VerificationResult {
  status: VerificationStatus;
  company?: CompanyData;
  aresSource?: DataSource;
  geocoding?: Coordinates;
  geocodingSource?: DataSource;
  nameMatch?: NameMatchResult;
  errorMessage?: string;
}

export type NameMatchKind = "exact" | "partial" | "mismatch";

export interface NameMatchResult {
  kind: NameMatchKind;
  inputName: string;
  aresName: string;
  message: string;
}

export interface SavedCompany extends CompanyData {
  lastVerifiedAt: number;
  lastSource: DataSource;
  lat: number | null;
  lng: number | null;
}
