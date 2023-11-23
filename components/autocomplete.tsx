"use client";

import { useFetch } from "@/hooks/useFetch";
import { cn } from "@/utils/cn";
import { sleep } from "@/utils/sleep";
import { useAutocomplete } from "@mui/base";
import { Popper } from "@mui/base/Popper";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import { ChevronDown, LoaderIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Entry {
  API: string;
  Auth: string;
  Category: string;
  Description: string;
  HTTPS: boolean;
  Link: string;
}

export default function Autocomplete() {
  const [query, setQuery] = useState("");

  const { data, loading } = useFetch<{
    count: number;
    entries: Entry[] | null;
  }>(`https://api.publicapis.org/entries?title=${query}`);

  const options = data?.entries || [];

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    getPopupIndicatorProps,
    popupOpen,
    anchorEl,
    setAnchorEl,
    groupedOptions,
    expanded,
  } = useAutocomplete({
    options,
    filterOptions: (options) => options,
    isOptionEqualToValue: (option, value) => option.API === value.API,
    onChange: (_, value) => console.log(value),
    onInputChange: (_, value) => setQuery(value),
    getOptionLabel: (option) => option.API,
  });

  const ref = useRef(null);
  const rootRef = useForkRef(ref, setAnchorEl);

  return (
    <>
      <div
        className="group flex w-80 items-center rounded-lg bg-white text-neutral-800 shadow transition-all hover:bg-neutral-100"
        {...getRootProps()}
        ref={rootRef}
      >
        <input
          placeholder=""
          className="peer flex-1 bg-transparent px-3 py-1.5 outline-none"
          {...getInputProps()}
        />

        {expanded && loading && (
          <LoaderIcon className="animate-spin-slow mx-1.5 h-6 w-6 text-neutral-400" />
        )}
        <button
          className="my-1.5 mr-1.5 rounded p-0.5 hover:bg-neutral-200"
          {...getPopupIndicatorProps()}
        >
          <ChevronDown
            className={cn("h-6 w-6 transition-all", {
              "rotate-180": popupOpen,
            })}
          />
        </button>
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
