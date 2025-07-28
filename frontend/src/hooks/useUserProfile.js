import { useState, useEffect } from "react";

export function useUserProfile() {
  const [profile, setProfile] = useState({
    id: "user1",
    first_name: "John",
    last_name: "Doe",
    phone: "+1234567890",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zip_code: "94105",
    user_id: "user1",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  async function saveProfile(profileData) {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setProfile((prev) => ({ ...prev, ...profileData }));
    setLoading(false);
    return { data: { ...profile, ...profileData } };
  }

  return { profile, saveProfile, loading };
}
