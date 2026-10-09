import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ComplaintContext = createContext();

const STORAGE_KEY = 'nagriksetu_agra_complaints_v1';
const COUNTER_KEY = 'nagriksetu_agra_id_counter';

export const STATUS_OPTIONS = ['Created', 'Prepared', 'Under Review', 'Resolved'];

export const DEFAULT_PROTOTYPE_COMPLAINTS = [
  {
    id: 'CIV-1024',
    category: 'Road/Pothole',
    subject: 'Road damage and pothole issue',
    description:
      'A pothole and damaged road section was reported at the selected location in Agra causing traffic hazard and risk for commuters.',
    location: 'Agra, Uttar Pradesh',
    status: 'Under Review',
    createdAt: '2026-10-06T10:30:00.000Z',
    recommendedAuthority: 'Local Road Authority',
    officialPortalUrl: 'https://pgportal.gov.in/',
    portalName: 'CPGRAMS Central Portal',
    priority: 'High',
    originalText: 'Agra mein is road par bahut bada pothole hai.',
    aiAssisted: true,
    imageUrl: '/assets/civic_road_pothole.jpg',
  },
  {
    id: 'CIV-1025',
    category: 'Garbage',
    subject: 'Garbage collection issue',
    description:
      'Waste collection has not occurred as expected for three consecutive days from the designated collection point, creating severe sanitation concerns.',
    location: 'Agra, Uttar Pradesh',
    status: 'Under Review',
    createdAt: '2026-10-05T14:15:00.000Z',
    recommendedAuthority: 'Local Municipal Authority',
    officialPortalUrl: 'https://pgportal.gov.in/',
    portalName: 'CPGRAMS Central Portal',
    priority: 'Normal',
    originalText: 'Mere area mein 3 din se kachra nahi uthaya gaya.',
    aiAssisted: true,
    imageUrl: '/assets/civic_garbage_issue.jpg',
  },
  {
    id: 'CIV-1026',
    category: 'Streetlight',
    subject: 'Non-functional streetlight on residential lane',
    description:
      'Streetlight fixture was inspected and line fault resolved by the maintenance team on 4 Oct 2026.',
    location: 'Agra, Uttar Pradesh',
    status: 'Resolved',
    createdAt: '2026-10-04T09:00:00.000Z',
    recommendedAuthority: 'Local Municipal Authority',
    officialPortalUrl: null,
    portalName: null,
    priority: 'Normal',
    originalText: 'Mere area ki street light kaam nahi kar rahi hai.',
    aiAssisted: true,
    imageUrl: '/assets/civic_streetlight.jpg',
  },
  {
    id: 'CIV-1027',
    category: 'Water',
    subject: 'Low water supply pressure issue',
    description:
      'Low pressure drinking water supply reported for consecutive mornings. Tank filling requires extended duration.',
    location: 'Agra, Uttar Pradesh',
    status: 'Created',
    createdAt: '2026-10-06T16:45:00.000Z',
    recommendedAuthority: 'Local Water Supply Authority',
    officialPortalUrl: 'https://pgportal.gov.in/',
    portalName: 'CPGRAMS Central Portal',
    priority: 'Normal',
    originalText: 'Agra ke is area mein paani ki supply nahi aa rahi.',
    aiAssisted: true,
    imageUrl: '/assets/civic_water_supply.jpg',
  },
];

export function ComplaintProvider({ children }) {
  const [confirmedComplaints, setConfirmedComplaints] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return DEFAULT_PROTOTYPE_COMPLAINTS;
    } catch {
      return DEFAULT_PROTOTYPE_COMPLAINTS;
    }
  });

  const [activeComplaint, setActiveComplaint] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(confirmedComplaints));
    } catch {
      // Fallback silently
    }
  }, [confirmedComplaints]);

  /**
   * Generate sequential/prototype ID e.g. CIV-1024
   */
  const getNextComplaintId = useCallback(() => {
    let current = 1024;
    try {
      const stored = localStorage.getItem(COUNTER_KEY);
      if (stored) {
        current = parseInt(stored, 10);
      }
      localStorage.setItem(COUNTER_KEY, String(current + 1));
    } catch {
      current = Math.floor(1000 + Math.random() * 9000);
    }
    return `CIV-${current}`;
  }, []);

  /**
   * Save a confirmed complaint with authority recommendation into application state.
   */
  const saveConfirmedComplaint = useCallback(
    (complaint) => {
      const newId = getNextComplaintId();
      const newEntry = {
        id: newId,
        subject: complaint.subject,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location,
        priority: complaint.priority || 'Normal',
        originalText: complaint.originalText || '',
        imageUrl: complaint.imageUrl || null,
        status: 'Under Review', // Default prototype status as specified
        createdAt: new Date().toISOString(),
        recommendedAuthority: complaint.recommendedAuthority || null,
        officialPortalUrl: complaint.officialPortalUrl || null,
        portalName: complaint.portalName || null,
        aiAssisted: complaint.aiAssisted !== undefined ? complaint.aiAssisted : true,
        timelineHistory: [
          { status: 'Created', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { status: 'Prepared', timestamp: new Date(Date.now() - 1800000).toISOString() },
          { status: 'Channel Selected', timestamp: new Date(Date.now() - 600000).toISOString() },
          { status: 'Under Review', timestamp: new Date().toISOString() },
        ],
      };

      setConfirmedComplaints((prev) => [newEntry, ...prev]);
      setActiveComplaint(newEntry);
      return newEntry;
    },
    [getNextComplaintId],
  );

  /**
   * Update the status of a prototype complaint (for demonstration & testing)
   */
  const updateComplaintStatus = useCallback((id, newStatus) => {
    setConfirmedComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
    );
    setActiveComplaint((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev));
  }, []);

  const getComplaintById = useCallback(
    (id) => confirmedComplaints.find((c) => c.id === id) || null,
    [confirmedComplaints],
  );

  const clearComplaints = useCallback(() => {
    setConfirmedComplaints([]);
    setActiveComplaint(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(COUNTER_KEY, '1024');
    } catch {
      // Ignore
    }
  }, []);

  const resetToDefaultComplaints = useCallback(() => {
    setConfirmedComplaints(DEFAULT_PROTOTYPE_COMPLAINTS);
    setActiveComplaint(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROTOTYPE_COMPLAINTS));
      localStorage.setItem(COUNTER_KEY, '1028');
    } catch {
      // Ignore
    }
  }, []);

  return (
    <ComplaintContext.Provider
      value={{
        confirmedComplaints,
        activeComplaint,
        setActiveComplaint,
        saveConfirmedComplaint,
        updateComplaintStatus,
        getComplaintById,
        clearComplaints,
        resetToDefaultComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const ctx = useContext(ComplaintContext);
  if (!ctx) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return ctx;
}
