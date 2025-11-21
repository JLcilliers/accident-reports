// Data models for the accident reports application

export interface AccidentDetails {
  state: string;
  city: string;
  date: string; // ISO format
  time?: string;
  incidentType: string;
  licensePlate?: string;
  policeDepartment?: string;
}

export interface Report {
  id: string;
  accidentDetails: AccidentDetails;
  vehiclesInvolved: number;
  injuriesReported: boolean;
  status: "summary" | "full" | "pending";
  policeDept: string;
  downloadUrl?: string;
}

export interface ReportRequest {
  id: string;
  accidentDetails: AccidentDetails;
  contact: {
    name: string;
    email: string;
    phone?: string;
    consentLegalContact: boolean;
    injuredOrDamage: boolean;
  };
  createdAt: string;
  matchedReportId?: string;
}

export interface LegalLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  state: string;
  description: string;
  reportId?: string;
  createdAt: string;
}
