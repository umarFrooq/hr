import React, { useState } from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items",
  className,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value) => {
    onChange(selected.filter((item) => item !== value));
  };

  const handleClear = () => {
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            selected.length === 0 ? "text-muted-foreground" : "",
            className,
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {selected.length === 0
              ? placeholder
              : `${selected.length} selected`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[240px]">
        <div className="flex items-center justify-between p-2 border-b">
          <span className="text-sm text-muted-foreground">
            {selected.length} of {options.length} selected
          </span>
          {selected.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1 p-2 border-b">
            {selected.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <Badge key={value} variant="secondary" className="mr-1 mb-1">
                  {option?.label || value}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => handleRemove(value)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-64">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary border-primary"
                            : "opacity-50",
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
