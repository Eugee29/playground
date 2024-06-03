"use client"

import { City } from "@/data/cities"
import { useDebounce } from "@/hooks/useDebounce"
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react"
import axios from "axios"
import { ChevronDown, Loader2 } from "lucide-react"
import { KeyboardEvent, useState } from "react"
import useSWR from "swr"

export default function HeadlessAutocomplete() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  const [selectedCities, setSelectedCities] = useState<City[]>([])

  const { data: options, isLoading } = useSWR(
    `/api/cities?name=${debouncedQuery}`,
    fetcher,
  )

  async function fetcher(url: string) {
    const { data } = await axios.get<City[]>(url)
    return data
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Backspace" && !query)
      setSelectedCities(selectedCities.slice(0, -1))
  }

  const removeCity = (city: City) =>
    setSelectedCities(selectedCities.filter((c) => c.code !== city.code))

  return (
    <div dir="rtl">
      <Combobox multiple value={selectedCities} onChange={setSelectedCities}>
        <div className="flex w-80 flex-wrap gap-1.5 rounded-lg bg-white p-1.5 shadow">
          {selectedCities.map((city) => (
            <button
              key={city.code}
              onClick={() => removeCity(city)}
              className="flex h-7 items-center gap-0.5 rounded border px-1 text-sm transition-all duration-100 hover:bg-neutral-200"
            >
              {city.name}
            </button>
          ))}
          <div className="min-w-20 relative -mx-1.5 h-7 flex-1">
            <ComboboxInput
              className="size-full rounded-lg px-1.5 outline-none"
              displayValue={(city) => (city as City)?.name}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              onKeyDown={handleKeyDown}
            />
            <div className="absolute inset-y-0 left-0 flex items-center gap-1 bg-white px-1.5">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <ComboboxButton className="group rounded hover:bg-neutral-200">
                <ChevronDown className="transition-transform group-data-[open]:rotate-180" />
              </ComboboxButton>
            </div>
          </div>
        </div>
        <Transition
          enter="duration-200 ease-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="duration-300 ease-out"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
        >
          <ComboboxOptions
            dir="rtl"
            className="w-80 rounded-lg bg-white p-3 shadow  transition [--anchor-gap:12px] empty:hidden"
            anchor="bottom end"
          >
            {options?.map((city) => (
              <ComboboxOption
                key={city.code}
                value={city}
                className="cursor-pointer rounded-lg px-3 py-1.5 data-[focus]:bg-neutral-200 data-[selected]:text-blue-400"
              >
                {city.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Transition>
      </Combobox>
    </div>
  )
}
