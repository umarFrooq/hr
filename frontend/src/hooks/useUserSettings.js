import { useState, useEffect, useCallback } from "react";

export function useUserSettings() {
  const [settings, setSettings] = useState({
    id: 1,
    theme: "light",
    notification_prefs: { email: true, push: false },
    accent_color: "blue",
    animations_enabled: true,
    font_size: "medium",
    session_timeout_minutes: 30,
    two_factor_enabled: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (updates) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    setSettings((prev) => ({ ...prev, ...updates }));
    setLoading(false);
    return { data: { ...settings, ...updates }, error: null };
  };

  return {
    settings,
    setSettings,
    updateSettings,
    loading,
    refetch: fetchSettings,
  };
}
