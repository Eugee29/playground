"use client";

import { useFetch } from "@/hooks/useFetch";
import { cn } from "@/utils/cn";
import { useAutocomplete } from "@mui/base";
import { Popper } from "@mui/base/Popper";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import { ChevronDown, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

interface Entry {
  API: string;
  Auth: string;
  Category: string;
  Description: string;
  HTTPS: boolean;
  Link: string;
}

export default function Autocomplete() {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<Entry[]>([]);

  const { data, loading } = useFetch<{
    count: number;
    entries: Entry[] | null;
  }>(`https://api.publicapis.org/entries?title=${inputValue}`);

  const options = data?.entries || [];

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    getPopupIndicatorProps,
    getTagProps,
    setAnchorEl,
    popupOpen,
    anchorEl,
    groupedOptions,
    focused,
  } = useAutocomplete({
    options,
    value,
    inputValue,
    multiple: true,
    disableCloseOnSelect: true,
    filterOptions: (options) => options,
    isOptionEqualToValue: (option, value) =>
      option.Description === value.Description,
    onChange: (_, value) => setValue(value),
    onInputChange: (_, value) => setInputValue(value),
    getOptionLabel: (option) => option.API,
  });

  const ref = useRef(null);
  const rootRef = useForkRef(ref, setAnchorEl);

  return (
    <>
      <div
        className="group flex w-80 flex-wrap gap-1 rounded-lg bg-white p-1.5 text-neutral-800 shadow transition-all hover:bg-neutral-100"
        {...getRootProps()}
        ref={rootRef}
      >
        {value.map((value, index) => {
          const { onDelete, key, ...rest } = getTagProps({ index });
          return (
            <button
              key={key}
              {...rest}
              type="button"
              className="flex h-7 items-center gap-0.5 rounded border px-1 text-sm hover:text-red-900"
              onClick={onDelete}
            >
              {value.API}
              <X className="h-3.5 w-3.5" />
            </button>
          );
        })}
        <div className="flex flex-1 items-center">
          <input
            placeholder=""
            className="peer h-full w-0 min-w-[60px] flex-1 bg-transparent px-1.5 outline-none"
            {...getInputProps()}
          />

          {focused && loading && inputValue && (
            <Loader2 className="mx-1.5 h-5 w-5 animate-spin text-neutral-400" />
          )}
          <button
            className="rounded p-0.5 hover:bg-neutral-200"
            {...getPopupIndicatorProps()}
          >
            <ChevronDown
              className={cn("h-6 w-6 transition-all", {
                "rotate-180": popupOpen,
              })}
            />
          </button>
        </div>
      </div>

      <Popper open={popupOpen} anchorEl={anchorEl}>
        {groupedOptions.length > 0 && (
          <ul
            className="scrollbar scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-lg scrollbar-w-1.5 my-1 max-h-80 overflow-y-auto rounded-lg border bg-white p-3 text-neutral-800 shadow"
            style={{ width: anchorEl?.clientWidth }}
            {...getListboxProps()}
          >
            {(groupedOptions as typeof options).map((option, index) => {
              const { key, ...optionProps } = getOptionProps({
                option,
                index,
              }) as { key: React.Key };
              return (
                <li
                  className="group cursor-pointer rounded-lg px-3 py-1.5 aria-selected:text-blue-500 [&.Mui-focused]:bg-neutral-200"
                  key={index}
                  {...optionProps}
                >
                  {option.API}
                </li>
              );
            })}
          </ul>
        )}
      </Popper>
    </>
  );
}
