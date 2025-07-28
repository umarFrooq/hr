import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function useAttendance() {
  const [attendanceLogs, setAttendanceLogs] = useState([
    {
      id: 1,
      date: "2025-06-28",
      check_in_time: "09:00:00",
      check_out_time: "17:30:00",
      work_hours: "8:30",
      status: "Present",
      work_type: "Office",
      location: "Main Office",
    },
    {
      id: 2,
      date: "2025-06-27",
      check_in_time: "09:15:00",
      check_out_time: "17:45:00",
      work_hours: "8:30",
      status: "Present",
      work_type: "Office",
      location: "Main Office",
    },
    {
      id: 3,
      date: "2025-06-26",
      check_in_time: "08:45:00",
      check_out_time: "17:15:00",
      work_hours: "8:30",
      status: "Present",
      work_type: "Remote",
      location: "Home",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const profile = { user_id: "user1" };

  const checkIn = async (location = "Main Office") => {
    setCheckingIn(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const today = new Date().toISOString().slice(0, 10);
    const checkInTime = new Date().toTimeString().slice(0, 8);

    const newLog = {
      id: attendanceLogs.length + 1,
      date: today,
      check_in_time: checkInTime,
      check_out_time: null,
      work_hours: null,
      status: "Present",
      work_type: "Office",
      location,
    };

    setAttendanceLogs((prev) => [newLog, ...prev]);
    setCheckingIn(false);

    toast({ title: "Checked In", description: "Your check-in was recorded." });
  };

  const checkOut = async () => {
    setCheckingOut(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const today = new Date().toISOString().slice(0, 10);
    const checkOutTime = new Date().toTimeString().slice(0, 8);

    setAttendanceLogs((prev) =>
      prev.map((log) => {
        if (log.date === today && !log.check_out_time) {
          const checkIn = new Date(`${today}T${log.check_in_time}`);
          const checkOut = new Date(`${today}T${checkOutTime}`);
          const diffMs = checkOut - checkIn;
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

          return {
            ...log,
            check_out_time: checkOutTime,
            work_hours: `${hours}:${minutes.toString().padStart(2, "0")}`,
          };
        }
        return log;
      }),
    );

    setCheckingOut(false);
    toast({
      title: "Checked Out",
      description: "Your check-out was recorded.",
    });
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayLog = attendanceLogs.find((log) => log.date === today);

  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthLogs = attendanceLogs.filter((log) => {
      const logDate = new Date(log.date);
      return (
        logDate.getMonth() === currentMonth &&
        logDate.getFullYear() === currentYear
      );
    });

    return [
      {
        label: "Days Present",
        value: thisMonthLogs.filter((x) => x.status === "Present").length,
      },
      {
        label: "Work from Home",
        value: thisMonthLogs.filter((x) => x.work_type === "Remote").length,
      },
      {
        label: "On Leave",
        value: thisMonthLogs.filter((x) => x.status === "Leave").length,
      },
      {
        label: "Weekends/Holidays",
        value: thisMonthLogs.filter(
          (x) => x.status === "Weekend" || x.status === "Holiday",
        ).length,
      },
    ];
  };

  const getOvertimeStats = () => {
    let totalOver = 0;
    let count = 0;

    attendanceLogs.forEach((log) => {
      if (log.work_hours && typeof log.work_hours === "string") {
        const [hours, minutes] = log.work_hours.split(":").map(Number);
        const totalHours = hours + minutes / 60;
        if (totalHours > 8) {
          totalOver += totalHours - 8;
          count += 1;
        }
      }
    });

    const avg = count ? totalOver / count : 0;
    return {
      total: totalOver.toFixed(1),
      avg: avg.toFixed(1),
    };
  };

  const refetch = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(false);
  };

  return {
    loading,
    attendanceLogs,
    checkIn,
    checkOut,
    checkingIn,
    checkingOut,
    todayLog,
    refetch,
    monthlyStats: getMonthlyStats(),
    overtimeStats: getOvertimeStats(),
  };
}
