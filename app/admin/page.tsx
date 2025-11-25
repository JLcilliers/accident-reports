"use client";

import { useState } from "react";

type TabType = "incidents" | "manual-lookup" | "leads";

// Mock data for incidents
const mockIncidents = [
  { id: "INC-001", date: "2025-01-15", location: "Los Angeles, CA", type: "Vehicle Collision", status: "Found", name: "John Smith", email: "john@email.com" },
  { id: "INC-002", date: "2025-01-14", location: "Houston, TX", type: "Motorcycle Accident", status: "Pending", name: "Maria Garcia", email: "maria@email.com" },
  { id: "INC-003", date: "2025-01-13", location: "Phoenix, AZ", type: "Pedestrian Accident", status: "Found", name: "Robert Johnson", email: "robert@email.com" },
  { id: "INC-004", date: "2025-01-12", location: "Chicago, IL", type: "Vehicle Collision", status: "Manual Lookup", name: "Emily Davis", email: "emily@email.com" },
  { id: "INC-005", date: "2025-01-11", location: "Miami, FL", type: "Truck Accident", status: "Found", name: "Michael Brown", email: "michael@email.com" },
];

// Mock data for manual lookup queue
const mockManualLookup = [
  { id: "ML-001", incidentId: "INC-004", requestDate: "2025-01-12", location: "Chicago, IL", reason: "Report not in database", priority: "High", assignedTo: "Agent A" },
  { id: "ML-002", incidentId: "INC-006", requestDate: "2025-01-10", location: "Denver, CO", reason: "Multiple possible matches", priority: "Medium", assignedTo: "Agent B" },
  { id: "ML-003", incidentId: "INC-007", requestDate: "2025-01-09", location: "Seattle, WA", reason: "Partial information", priority: "Low", assignedTo: "Unassigned" },
];

// Mock data for leads
const mockLeads = [
  { id: "LEAD-001", name: "John Smith", phone: "(555) 123-4567", email: "john@email.com", injuryType: "Whiplash", sentTo: "Smith & Associates", sentDate: "2025-01-15", status: "Contacted" },
  { id: "LEAD-002", name: "Maria Garcia", phone: "(555) 234-5678", email: "maria@email.com", injuryType: "Back Injury", sentTo: "Johnson Law Group", sentDate: "2025-01-14", status: "Pending" },
  { id: "LEAD-003", name: "Robert Johnson", phone: "(555) 345-6789", email: "robert@email.com", injuryType: "Broken Arm", sentTo: "Davis Legal", sentDate: "2025-01-13", status: "Converted" },
  { id: "LEAD-004", name: "Emily Davis", phone: "(555) 456-7890", email: "emily@email.com", injuryType: "Concussion", sentTo: "Smith & Associates", sentDate: "2025-01-12", status: "No Response" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("incidents");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "incidents" as TabType, label: "Incidents", count: mockIncidents.length },
    { id: "manual-lookup" as TabType, label: "Manual Lookup Queue", count: mockManualLookup.length },
    { id: "leads" as TabType, label: "Leads", count: mockLeads.length },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "found":
      case "converted":
      case "contacted":
        return "bg-[#B6FF2C]/20 text-[#B6FF2C]";
      case "pending":
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "manual lookup":
      case "high":
      case "no response":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-[#1C2430] text-[#A5B1C5]";
    }
  };

  return (
    <div className="bg-[#05070B] min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 py-8 max-w-[1400px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-[#A5B1C5]">Manage incidents, manual lookups, and leads</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#B6FF2C] text-[#05070B]"
                  : "bg-[#0C1016] text-[#A5B1C5] border border-[#1C2430] hover:border-[#B6FF2C] hover:text-[#B6FF2C]"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-[#05070B]/20 text-[#05070B]" : "bg-[#1C2430] text-[#A5B1C5]"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A5B1C5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 pl-12 pr-4 py-3 bg-[#0C1016] border border-[#1C2430] rounded-lg text-white placeholder-[#A5B1C5] focus:outline-none focus:border-[#B6FF2C] focus:ring-1 focus:ring-[#B6FF2C] transition"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#0C1016] rounded-[14px] border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="overflow-x-auto">
            {/* Incidents Table */}
            {activeTab === "incidents" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1C2430]">
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">ID</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Date</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Location</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Type</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Name</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Email</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Status</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockIncidents.map((incident) => (
                    <tr key={incident.id} className="border-b border-[#1C2430] hover:bg-[#05070B] transition">
                      <td className="px-6 py-4 text-white font-mono text-sm">{incident.id}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{incident.date}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{incident.location}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{incident.type}</td>
                      <td className="px-6 py-4 text-white">{incident.name}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{incident.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[#B6FF2C] hover:text-[#8EE522] transition text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Manual Lookup Queue Table */}
            {activeTab === "manual-lookup" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1C2430]">
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">ID</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Incident ID</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Request Date</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Location</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Reason</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Priority</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Assigned To</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockManualLookup.map((item) => (
                    <tr key={item.id} className="border-b border-[#1C2430] hover:bg-[#05070B] transition">
                      <td className="px-6 py-4 text-white font-mono text-sm">{item.id}</td>
                      <td className="px-6 py-4 text-[#B6FF2C] font-mono text-sm">{item.incidentId}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{item.requestDate}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{item.location}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{item.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{item.assignedTo}</td>
                      <td className="px-6 py-4">
                        <button className="text-[#B6FF2C] hover:text-[#8EE522] transition text-sm font-medium mr-3">
                          Assign
                        </button>
                        <button className="text-[#A5B1C5] hover:text-white transition text-sm font-medium">
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Leads Table */}
            {activeTab === "leads" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1C2430]">
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">ID</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Name</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Phone</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Email</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Injury Type</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Sent To</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Sent Date</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Status</th>
                    <th className="text-left text-[#A5B1C5] font-semibold px-6 py-4 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-[#1C2430] hover:bg-[#05070B] transition">
                      <td className="px-6 py-4 text-white font-mono text-sm">{lead.id}</td>
                      <td className="px-6 py-4 text-white">{lead.name}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{lead.phone}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{lead.email}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{lead.injuryType}</td>
                      <td className="px-6 py-4 text-[#B6FF2C]">{lead.sentTo}</td>
                      <td className="px-6 py-4 text-[#A5B1C5]">{lead.sentDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[#B6FF2C] hover:text-[#8EE522] transition text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-[#A5B1C5] text-sm">
            Showing 1-{activeTab === "incidents" ? mockIncidents.length : activeTab === "manual-lookup" ? mockManualLookup.length : mockLeads.length} results
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#0C1016] border border-[#1C2430] rounded-lg text-[#A5B1C5] hover:border-[#B6FF2C] hover:text-[#B6FF2C] transition text-sm font-medium disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 bg-[#0C1016] border border-[#1C2430] rounded-lg text-[#A5B1C5] hover:border-[#B6FF2C] hover:text-[#B6FF2C] transition text-sm font-medium disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
