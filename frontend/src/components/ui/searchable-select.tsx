import * as React from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: ComboboxOption[];
  value?: string;
  onSelect: (value: string) => void;
  onSearchChange: (search: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  notFoundText: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  allowClear?: boolean;
  renderOptions?: (
    options: ComboboxOption[],
    value: string | undefined,
    onSelect: (value: string) => void
  ) => React.ReactNode;
}

export function SearchableSelect({
  options,
  value,
  onSelect,
  onSearchChange,
  placeholder,
  searchPlaceholder,
  notFoundText,
  disabled = false,
  isLoading = false,
  className = "",
  allowClear = true,
  renderOptions,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  const handleSearchChange = (search: string) => {
    setSearchValue(search);
    onSearchChange(search);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchValue("");
      onSearchChange("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(""); // Clear the selection
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // If clicking on the clear button area, don't open dropdown
    const target = e.target as HTMLElement;
    if (target.closest("[data-clear-button]")) {
      return;
    }
    // Let the popover handle opening
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between relative", className)}
          disabled={disabled}
          onClick={handleButtonClick}
        >
          <span className="truncate text-left">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1 ml-2">
            {allowClear && selectedOption && !disabled && (
              <div
                data-clear-button
                className="flex items-center justify-center h-4 w-4 rounded hover:bg-gray-200 cursor-pointer"
                onClick={handleClear}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <X className="h-3 w-3" />
              </div>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", className)} align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleSearchChange}
            value={searchValue}
          />
          <CommandList>
            {isLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </div>
            )}
            {!isLoading && options.length === 0 && <CommandEmpty>{notFoundText}</CommandEmpty>}
            {!isLoading &&
              options.length > 0 &&
              (renderOptions
                ? renderOptions(options, value, (v) => {
                    onSelect(v);
                    setOpen(false);
                  })
                : options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onSelect(option.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  )))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
