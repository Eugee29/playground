"use client"

import { City } from "@/data/cities"
import { cn } from "@/utils/cn"
import { sleep } from "@/utils/sleep"
import { useAutocomplete } from "@mui/base"
import { Popper } from "@mui/base/Popper"
import { unstable_useForkRef as useForkRef } from "@mui/utils"
import axios from "axios"
import { Check, ChevronDown, Loader2, X } from "lucide-react"
import { useRef, useState } from "react"
import useSWR from "swr"

export default function Autocomplete() {
  const [inputValue, setInputValue] = useState("")
  const [value, setValue] = useState<City[]>([])

  const { data, isLoading } = useSWR(`/api/cities?name=${inputValue}`, fetcher)

  async function fetcher(url: string) {
    await sleep(1000)
    const { data } = await axios.get<City[]>(url)
    return data
  }

  const options = data || []

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
    autoComplete: true,
    filterOptions: (options) => options,
    onChange: (_, value) => setValue(value),
    onInputChange: (_, value) => setInputValue(value),
    getOptionLabel: (city) => city.name,
  })

  const ref = useRef(null)
  const rootRef = useForkRef(ref, setAnchorEl)

  return (
    <>
      <div
        dir="rtl"
        className="flex w-80 flex-wrap gap-1 rounded-lg bg-white p-1.5 text-neutral-800 shadow transition-all hover:bg-neutral-50"
        {...getRootProps()}
        ref={rootRef}
      >
        {value.map((value, index) => {
          const { onDelete, key, ...rest } = getTagProps({ index })
          return (
            <button
              key={key}
              {...rest}
              type="button"
              className="flex h-7 items-center gap-0.5 rounded border px-1 text-sm transition-all duration-100 hover:bg-neutral-200"
              onClick={onDelete}
            >
              {value.name}
              <X className="h-3.5 w-3.5" />
            </button>
          )
        })}
        <div className="flex flex-1 items-center">
          <input
            placeholder=""
            className="peer h-full w-0 min-w-[60px] flex-1 bg-transparent px-1.5 outline-none"
            {...getInputProps()}
          />

          {focused && isLoading && (
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
        {!isLoading && (
          <ul
            dir="rtl"
            style={{ width: anchorEl?.clientWidth }}
            {...getListboxProps()}
            className="scrollbar scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-lg scrollbar-w-1.5 my-1 max-h-80 overflow-y-auto rounded-lg border bg-white p-3 text-neutral-800 shadow"
          >
            {!groupedOptions.length ? (
              <span className="text-sm text-neutral-600">
                לא נמצאו תוצאות...
              </span>
            ) : (
              <>
                {(groupedOptions as typeof options).map((option, index) => {
                  const { key, ...optionProps } = getOptionProps({
                    option,
                    index,
                  }) as { key: React.Key }

                  return (
                    <li
                      className="group/option flex cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 aria-selected:text-blue-500 [&.Mui-focused]:bg-neutral-200"
                      key={index}
                      {...optionProps}
                    >
                      {option.name}
                      <Check className="hidden h-4 w-4 group-aria-selected/option:block" />
                    </li>
                  )
                })}
              </>
            )}
          </ul>
        )}
      </Popper>
    </>
  )
}
