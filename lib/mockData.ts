// Mock data for development and MVP demonstration
import { Report, ReportRequest, LegalLead } from "./types";

// Mock reports that can be "found" in the system
export const mockReports: Report[] = [
  {
    id: "RPT-001",
    accidentDetails: {
      state: "Colorado",
      city: "Denver",
      date: "2025-01-15",
      time: "14:30",
      incidentType: "Car Accident",
      policeDepartment: "Denver Police Department",
    },
    vehiclesInvolved: 2,
    injuriesReported: true,
    status: "full",
    policeDept: "Denver Police Department",
    downloadUrl: "/sample-report.pdf",
  },
  {
    id: "RPT-002",
    accidentDetails: {
      state: "Texas",
      city: "Austin",
      date: "2025-01-10",
      time: "09:15",
      incidentType: "Motorcycle Accident",
      policeDepartment: "Austin Police Department",
    },
    vehiclesInvolved: 1,
    injuriesReported: true,
    status: "summary",
    policeDept: "Austin Police Department",
  },
  {
    id: "RPT-003",
    accidentDetails: {
      state: "Florida",
      city: "Miami",
      date: "2025-01-12",
      time: "18:45",
      incidentType: "Truck Accident",
      policeDepartment: "Miami-Dade Police Department",
    },
    vehiclesInvolved: 3,
    injuriesReported: true,
    status: "full",
    policeDept: "Miami-Dade Police Department",
    downloadUrl: "/sample-report.pdf",
  },
];

// In-memory storage for report requests (will be replaced with database)
export const reportRequests: ReportRequest[] = [];

// In-memory storage for legal leads
export const legalLeads: LegalLead[] = [];

// Helper function to find a matching report
export function findMatchingReport(
  state: string,
  city: string,
  date: string
): Report | undefined {
  return mockReports.find(
    (report) =>
      report.accidentDetails.state.toLowerCase() === state.toLowerCase() &&
      report.accidentDetails.city.toLowerCase() === city.toLowerCase() &&
      report.accidentDetails.date === date
  );
}

// Helper to generate unique IDs
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
