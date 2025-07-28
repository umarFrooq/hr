import { useState, useEffect } from "react";

export function useUserRoles() {
  const [roles, setRoles] = useState(["employee"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setRoles(["employee"]);
      setLoading(false);
    }, 100);
  }, []);

  return { roles, loading };
}
