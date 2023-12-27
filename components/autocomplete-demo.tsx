"use client"

import Autocomplete from "@/components/autocomplete-compound"
import { City } from "@/data/cities"
import { cn } from "@/utils/cn"
import { sleep } from "@/utils/sleep"
import axios from "axios"
import { Check, ChevronDown, Loader2, X } from "lucide-react"
import { useState } from "react"
import useSWR from "swr"

export default function AutocompleteDemo() {
  const [inputValue, setInputValue] = useState("")
  const [value, setValue] = useState<City[]>([])

  const { data, isLoading } = useSWR(`/api/cities?name=${inputValue}`, fetcher)

  async function fetcher(url: string) {
    await sleep(1000)
    const { data } = await axios.get<City[]>(url)
    return data
  }

  const options = data || []

  return (
    <Autocomplete.Root
      options={options}
      value={value}
      inputValue={inputValue}
      multiple
      autoComplete
      onChange={(_, value) => setValue(value as City[])}
      onInputChange={(_, value) => setInputValue(value)}
      getOptionLabel={(city) => (city as City).name}
    >
      {({ popupOpen, groupedOptions, focused }) => (
        <>
          <div
            className="flex w-80 flex-wrap gap-1 rounded-lg bg-white p-1.5 text-neutral-800 shadow transition-all hover:bg-neutral-50"
            dir="rtl"
          >
            {value.map((value, index) => (
              <Autocomplete.Tag key={index} index={index}>
                {({ onDelete, ...props }) => (
                  <button
                    {...props}
                    onClick={onDelete}
                    className="flex h-7 items-center gap-0.5 rounded border px-1 text-sm transition-all duration-100 hover:bg-neutral-200"
                  >
                    {value.name}
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </Autocomplete.Tag>
            ))}
            <div className="flex flex-1 items-center">
              <Autocomplete.Input
                placeholder=""
                className="peer h-full w-0 min-w-[60px] flex-1 bg-transparent px-1.5 outline-none"
              />
              {focused && isLoading && (
                <Loader2 className="mx-1.5 h-5 w-5 animate-spin text-neutral-400" />
              )}
              <Autocomplete.PopupIndicator className="rounded p-0.5 hover:bg-neutral-200">
                <ChevronDown
                  className={cn("h-6 w-6 transition-all", {
                    "rotate-180": popupOpen,
                  })}
                />
              </Autocomplete.PopupIndicator>
            </div>
          </div>
          {!isLoading && (
            <Autocomplete.Listbox
              dir="rtl"
              className="scrollbar scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-lg scrollbar-w-1.5 my-1 max-h-80 overflow-y-auto rounded-lg border bg-white p-3 text-neutral-800 shadow"
            >
              {!groupedOptions.length ? (
                <span className="text-sm text-neutral-600">
                  לא נמצאו תוצאות...
                </span>
              ) : (
                <>
                  {(groupedOptions as typeof options).map((option, index) => (
                    <Autocomplete.Option
                      key={index}
                      className="group/option flex cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 aria-selected:text-blue-500 [&.Mui-focused]:bg-neutral-200"
                      option={option}
                      index={index}
                    >
                      {option.name}
                      <Check className="hidden h-4 w-4 group-aria-selected/option:block" />
                    </Autocomplete.Option>
                  ))}
                </>
              )}
            </Autocomplete.Listbox>
          )}
        </>
      )}
    </Autocomplete.Root>
  )
}
