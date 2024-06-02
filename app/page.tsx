import AutocompleteDemo from "@/components/autocomplete-demo"
import HeadlessAutocomplete from "@/components/headless-autocomplete"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-20 bg-neutral-50 text-neutral-800">
      <AutocompleteDemo />
      <HeadlessAutocomplete />
      {/* <Autocomplete /> */}
    </main>
  )
}
