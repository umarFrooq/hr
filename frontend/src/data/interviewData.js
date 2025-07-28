// Mock data has been replaced with DB data, these are just empty references
export const POSITIONS = [];
export const INTERVIEWERS = [];
export const INTERVIEW_TYPES = [];
export const INTERVIEWS = [];

// Interview status options
export const INTERVIEW_STATUSES = [
  "Scheduled",
  "Completed",
  "Cancelled",
  "No Show",
  "Rescheduled",
  "Pending",
];

// Helper function to format time from database format (HH:MM:SS) to UI format (HH:MM AM/PM)
export const formatTimeForDisplay = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
};

// Helper function to format time from UI format (HH:MM AM/PM) to database format (HH:MM:SS)
export const formatTimeForDatabase = (time) => {
  if (!time) return "";

  // If time already in 24-hour format, return as is with seconds
  if (!time.includes("AM") && !time.includes("PM")) {
    return `${time}:00`;
  }

  const [timePart, ampm] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map((part) => parseInt(part, 10));

  if (ampm.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
};

// Helper function to adapt interview data from database to UI format
export const adaptInterviewFromDatabase = (dbInterview) => {
  return {
    id: dbInterview.id,
    candidate: dbInterview.candidate,
    position: dbInterview.position,
    date: dbInterview.date,
    startTime: formatTimeForDisplay(dbInterview.start_time),
    endTime: formatTimeForDisplay(dbInterview.end_time),
    start_time: dbInterview.start_time,
    end_time: dbInterview.end_time,
    interviewers: dbInterview.interviewers || [],
    location: dbInterview.location,
    type: dbInterview.type,
    status: dbInterview.status,
    notes: dbInterview.notes,
    created_at: dbInterview.created_at,
    updated_at: dbInterview.updated_at,
  };
};

// Helper function to adapt interview data from UI to database format
export const adaptInterviewForDatabase = (interview) => {
  return {
    candidate: interview.candidate,
    position: interview.position,
    date: interview.date,
    start_time:
      interview.start_time || formatTimeForDatabase(interview.startTime),
    end_time: interview.end_time || formatTimeForDatabase(interview.endTime),
    interviewers: interview.interviewers,
    location: interview.location,
    type: interview.type,
    status: interview.status,
    notes: interview.notes,
  };
};
