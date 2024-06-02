"use client"

import { City } from "@/data/cities"
import { useDebounce } from "@/hooks/useDebounce"
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react"
import axios from "axios"
import { ChevronDown, Loader2 } from "lucide-react"
import { useState } from "react"
import useSWR from "swr"

export default function HeadlessAutocomplete() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const { data: options, isLoading } = useSWR(
    `/api/cities?name=${debouncedQuery}`,
    fetcher,
  )

  async function fetcher(url: string) {
    const { data } = await axios.get<City[]>(url)
    return data
  }

  return (
    <div dir="rtl">
      <Combobox value={selectedCity} onChange={setSelectedCity}>
        <div className="relative">
          <ComboboxInput
            className="w-80 rounded-lg bg-white py-1.5 pl-9 pr-3 shadow outline-none"
            displayValue={(city) => (city as City)?.name}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <div className="absolute left-0 top-1.5 flex items-center gap-1 bg-white px-1.5">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <ComboboxButton className="group rounded hover:bg-neutral-200">
              <ChevronDown className="transition-transform group-data-[open]:rotate-180" />
            </ComboboxButton>
          </div>
        </div>
        <ComboboxOptions
          dir="rtl"
          className="w-[var(--input-width)] rounded-lg bg-white p-3 shadow empty:hidden"
          anchor={{ to: "bottom", gap: 6 }}
        >
          {options?.map((city) => (
            <ComboboxOption
              key={city.code}
              value={city}
              className="cursor-pointer rounded-lg px-3 py-1.5 data-[focus]:bg-neutral-200"
            >
              {city.name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  )
}
