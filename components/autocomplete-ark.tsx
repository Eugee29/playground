"use client"

import { useFetch } from "@/hooks/useFetch"
import { Combobox, Portal } from "@ark-ui/react"
import { ChevronDownIcon, LoaderIcon, X } from "lucide-react"
import { useState } from "react"

interface Entry {
  API: string
  Auth: string
  Category: string
  Description: string
  HTTPS: boolean
  Link: string
}

export default function ArkAutocomplete() {
  const [query, setQuery] = useState("")

  const { data, loading } = useFetch<{
    count: number
    entries: Entry[] | null
  }>(`https://api.publicapis.org/entries?title=${query}`)

  const items =
    data?.entries?.map((entry) => ({
      value: entry.API,
      ...entry,
    })) || []

  // const filteredItems =
  //   query === ""
  //     ? items
  //     : items.filter((item) => {
  //         return item.API.toLowerCase().includes(query.toLowerCase());
  //       });

  return (
    <>
      <Combobox.Root items={items}>
        <Combobox.Control className="group flex w-80 rounded-lg border bg-white py-1.5 pl-3 pr-1.5 text-neutral-800 shadow transition-all focus-within:ring focus-within:ring-blue-400 focus-within:ring-offset-1 hover:bg-neutral-100">
          <Combobox.Input
            onChange={(e) => setQuery(e.target.value)}
            className="peer flex-1 bg-transparent outline-none"
          />
          {/* <Combobox.ClearTrigger className="hidden rounded p-0.5 transition-all hover:bg-neutral-200 group-focus-within:peer-[:not(:placeholder-shown)]:block group-hover:peer-[:not(:placeholder-shown)]:block">
            <X className="h-5 w-5" />
          </Combobox.ClearTrigger> */}
          {loading && (
            <LoaderIcon className="mx-1.5 h-6 w-6 animate-spin-slow text-neutral-400" />
          )}
          <Combobox.Trigger className="group rounded p-0.5 transition-all hover:bg-neutral-200 ">
            <ChevronDownIcon className="h-5 w-5 transition-all group-data-[state=open]:rotate-180" />
          </Combobox.Trigger>
        </Combobox.Control>

        <Portal>
          <Combobox.Positioner>
            {items.length > 0 && (
              <Combobox.Content className="scrollbar scrollbar-thumb-neutral-200 scrollbar-thumb-rounded-lg scrollbar-w-1.5 max-h-80 overflow-y-auto rounded-lg border bg-white p-3 text-neutral-800 shadow">
                {items.map((item, index) => (
                  <Combobox.Item
                    className="group cursor-pointer rounded-lg px-3 py-1.5 data-[highlighted]:bg-neutral-200"
                    key={index}
                    item={item}
                  >
                    <Combobox.ItemText className="group-data-[state=checked]:text-blue-400">
                      {item.API}
                    </Combobox.ItemText>
                  </Combobox.Item>
                ))}
              </Combobox.Content>
            )}
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </>
  )
}
