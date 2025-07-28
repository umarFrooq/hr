import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAllOrganizationsQuery } from "@/store/api/organizationsApi";
import { SearchableSelect } from "@/components/ui/searchable-select";

/**
 * OrganizationDropdownFilter
 * @param {string} searchKey - The query param key to set (e.g., "organizationId")
 * @param {string} placeholder - Placeholder for the dropdown
 * @param {number} [delay=400] - Debounce delay for search
 */
const OrganizationDropdownFilter = ({
  searchKey = "organizationId",
  placeholder = "Filter by organization...",
  delay = 400,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, delay);
  const [selected, setSelected] = useState(searchParams.get(searchKey) ?? "");

  // Fetch organizations, optionally filtered by search
  const { data, isLoading } = useGetAllOrganizationsQuery(
    debouncedSearch ? { name: "name", value: debouncedSearch, limit: 100 } : { limit: 100 }
  );
  const orgOptions = data?.results || [];

  // Update URL param when selected changes
  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (selected) {
      params[searchKey] = selected;
      setSearchParams(params);
    } else {
      delete params[searchKey];
      setSearchParams(params);
    }
    // eslint-disable-next-line
  }, [selected, searchKey]);

  // Keep selected in sync with URL (if user navigates back/forward)
  useEffect(() => {
    setSelected(searchParams.get(searchKey) ?? "");
    // eslint-disable-next-line
  }, [searchParams, searchKey]);

  // Map orgOptions to the format expected by SearchableSelect
  const selectOptions = orgOptions.map((org) => ({
    value: org.id,
    label: org.name,
  }));

  return (
    <div className="relative w-full max-w-xs">
      <SearchableSelect
        options={selectOptions}
        value={selected}
        onSelect={setSelected}
        onSearchChange={setSearch}
        placeholder={placeholder}
        searchPlaceholder="Search organizations..."
        notFoundText="No organizations found"
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrganizationDropdownFilter;
