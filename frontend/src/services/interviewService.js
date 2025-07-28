import { toast } from "@/hooks/use-toast";

// Static interview data
let interviews = [
  {
    id: "1",
    candidate: "Alice Johnson",
    position: "Frontend Developer",
    date: "2025-07-01",
    startTime: "10:00",
    endTime: "11:00",
    type: "Technical",
    location: "Conference Room A",
    status: "Scheduled",
    interviewers: ["Sarah Wilson", "Mike Chen"],
    notes: "Initial technical screening",
  },
  {
    id: "2",
    candidate: "Bob Brown",
    position: "Backend Developer",
    date: "2025-07-02",
    startTime: "14:00",
    endTime: "15:00",
    type: "Initial Screening",
    location: "Conference Room B",
    status: "Scheduled",
    interviewers: ["David Lee"],
    notes: "Phone screening completed",
  },
  {
    id: "3",
    candidate: "Carol Davis",
    position: "UX Designer",
    date: "2025-07-03",
    startTime: "09:30",
    endTime: "10:30",
    type: "Portfolio Review",
    location: "Design Studio",
    status: "Completed",
    interviewers: ["Jennifer Smith", "Lisa Wong"],
    notes: "Portfolio presentation went well",
  },
];

// Fetch all interviews
export const fetchInterviews = async () => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return interviews.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    toast({
      title: "Error fetching interviews",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Fetch interview by ID
export const fetchInterviewById = async (id) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return interviews.find((interview) => interview.id === id) || null;
  } catch (error) {
    toast({
      title: "Error fetching interview details",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Create new interview
export const createInterview = async (interview) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newInterview = {
      ...interview,
      id: (interviews.length + 1).toString(),
      status: "Scheduled",
    };

    interviews.push(newInterview);

    toast({
      title: "Interview scheduled",
      description: `Interview with ${newInterview.candidate} has been scheduled.`,
    });

    return newInterview;
  } catch (error) {
    toast({
      title: "Error scheduling interview",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Update an interview
export const updateInterview = async (id, updatedInterview) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = interviews.findIndex((interview) => interview.id === id);
    if (index === -1) {
      throw new Error("Interview not found");
    }

    interviews[index] = { ...interviews[index], ...updatedInterview };

    toast({
      title: "Interview updated",
      description: `Interview with ${interviews[index].candidate} has been updated.`,
    });

    return interviews[index];
  } catch (error) {
    toast({
      title: "Error updating interview",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Delete an interview
export const deleteInterview = async (id, candidateName) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    interviews = interviews.filter((interview) => interview.id !== id);

    toast({
      title: "Interview deleted",
      description: `Interview with ${candidateName} has been deleted.`,
    });

    return true;
  } catch (error) {
    toast({
      title: "Error deleting interview",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Fetch all positions
export const fetchPositions = async () => {
  return [
    "Frontend Developer",
    "Backend Developer",
    "UX Designer",
    "Product Manager",
    "Data Analyst",
    "DevOps Engineer",
    "QA Engineer",
    "Project Manager",
  ];
};

// Fetch all interview types
export const fetchInterviewTypes = async () => {
  return [
    "Initial Screening",
    "Technical Interview",
    "Portfolio Review",
    "Culture Fit",
    "Final Round",
    "HR Interview",
  ];
};

// Fetch all interviewers
export const fetchInterviewers = async () => {
  return [
    "Sarah Wilson",
    "Mike Chen",
    "David Lee",
    "Jennifer Smith",
    "Lisa Wong",
    "Robert Miller",
    "Emma Davis",
    "Ryan Thompson",
    "James Wilson",
  ];
};
