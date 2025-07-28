import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CommandItem } from "@/components/ui/command";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DEPARTMENTS } from "@/utils/constant";

const DepartmentDropdownFilter = ({
  searchKey = "department",
  placeholder = "Filter by department...",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(searchParams.get(searchKey) ?? "");

  // Filter departments by search
  const filteredOptions = search
    ? DEPARTMENTS.filter((d) => d.label.toLowerCase().includes(search.toLowerCase()))
    : DEPARTMENTS;

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

  useEffect(() => {
    setSelected(searchParams.get(searchKey) ?? "");
    // eslint-disable-next-line
  }, [searchParams, searchKey]);

  // // Custom render for SearchableSelect to inject clear option at the top
  // const renderOptions = (options, value, onSelect) => (
  //   <>
  //     {value && (
  //       <CommandItem
  //         key="clear"
  //         value=""
  //         onSelect={() => onSelect("")}
  //         className="text-red-500 hover:bg-red-50 border-b"
  //       >
  //         Clear filter
  //       </CommandItem>
  //     )}
  //     {options.map((option) => (
  //       <CommandItem
  //         key={option.value}
  //         value={option.value}
  //         onSelect={(currentValue) => {
  //           onSelect(currentValue === value ? "" : currentValue);
  //         }}
  //       >
  //         {option.label}
  //       </CommandItem>
  //     ))}
  //   </>
  // );

  return (
    <div className="relative w-full max-w-xs">
      <SearchableSelect
        options={filteredOptions}
        value={selected}
        onSelect={setSelected}
        onSearchChange={setSearch}
        placeholder={placeholder}
        searchPlaceholder="Search departments..."
        notFoundText="No departments found"
        // renderOptions={renderOptions}
      />
    </div>
  );
};

export default DepartmentDropdownFilter;
