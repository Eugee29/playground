"use client";

import { useFetch } from "@/hooks/useFetch";
import { cn } from "@/utils/cn";
import { UseAutocompleteProps, useAutocomplete } from "@mui/base";
import { Popper } from "@mui/base/Popper";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import { ChevronDown, X } from "lucide-react";
import { useRef } from "react";

interface Option {
  label: string;
  [key: string]: unknown;
}

interface Props
  extends UseAutocompleteProps<Option, boolean, boolean, boolean> {
  className?: string;
}

export default function Autocomplete({
  className,
  ...autoCompleteProps
}: Props) {
  const ref = useRef(null);

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    getPopupIndicatorProps,
    getClearProps,
    popupOpen,
    anchorEl,
    setAnchorEl,
    groupedOptions,
    inputValue,
  } = useAutocomplete(autoCompleteProps);

  const { data, error, loading } = useFetch(
    "https://api.publicapis.org/entries?title=cat",
  );

  console.log({ data, error, loading });

  const rootRef = useForkRef(ref, setAnchorEl);

  return (
    <>
      <div
        className="group flex w-80 rounded-lg bg-white text-neutral-900 shadow transition-all hover:bg-neutral-100"
        {...getRootProps()}
        ref={rootRef}
      >
        <input
          placeholder=""
          className="peer flex-1 bg-transparent px-3 py-1.5 outline-none"
          {...getInputProps()}
        />
        {inputValue && (
          <button
            className="my-1.5 hidden rounded p-0.5 hover:bg-neutral-200 group-hover:block peer-focus:block"
            {...getClearProps()}
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <button
          className="my-1.5 mr-1.5 rounded p-0.5 hover:bg-neutral-200"
          {...getPopupIndicatorProps()}
        >
          <ChevronDown
            className={cn(
              "h-6 w-6 transition-all",
              popupOpen ? "rotate-180" : "",
            )}
          />
        </button>
      </div>

      <Popper open={popupOpen} anchorEl={anchorEl}>
        {groupedOptions.length > 0 && (
          <ul
            className="scrollbar scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-lg scrollbar-w-1.5 mt-1 max-h-80 overflow-y-auto rounded-lg border bg-white p-3 text-neutral-900 shadow"
            style={{ width: anchorEl?.clientWidth }}
            {...getListboxProps()}
          >
            {(groupedOptions as typeof autoCompleteProps.options).map(
              (option, index) => {
                const { key, ...optionProps } = getOptionProps({
                  option,
                  index,
                }) as { key: React.Key };
                return (
                  <li
                    className="group cursor-pointer rounded-lg px-3 py-1.5 aria-selected:text-blue-500 [&.Mui-focused]:bg-neutral-200"
                    key={key}
                    {...optionProps}
                  >
                    {option.label}
                  </li>
                );
              },
            )}
          </ul>
        )}
      </Popper>
    </>
  );
}
