import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";

/**
 * DataTableSearch
 * @param {string} placeholder - Placeholder for the search input
 * @param {string} searchKey - The key to use in the query param
 * @param {number} [delay=400] - Debounce delay in ms
 */
const DataTableSearch = ({ placeholder = "Search...", searchKey, delay = 400 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get(searchKey) ?? "");
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    if (debouncedValue) {
      setSearchParams({
        name: searchKey,
        value: debouncedValue,
      });
    } else {
      // Remove both 'name' and 'value' from the params
      const params = Object.fromEntries(searchParams);
      delete params["name"];
      delete params["value"];
      setSearchParams(params);
    }
  }, [debouncedValue, searchKey]);

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
        aria-label={placeholder}
      />
    </div>
  );
};

export default DataTableSearch;
