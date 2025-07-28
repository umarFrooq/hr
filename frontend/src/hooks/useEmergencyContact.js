import { useState, useEffect } from "react";

export function useEmergencyContact() {
  const [contact, setContact] = useState({
    contact_name: "Jane Doe",
    phone: "+1987654321",
    email: "jane.doe@email.com",
    relation: "Spouse",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  async function saveContact(contactData) {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setContact((prev) => ({ ...prev, ...contactData }));
    setLoading(false);
    return { data: { ...contact, ...contactData } };
  }

  return { contact, saveContact, loading };
}
