"use client";

import Autocomplete from "@/components/autocomplete";
import ArkAutocomplete from "@/components/autocomplete-ark";

export default function SearchForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex min-h-[600px] flex-col gap-8 rounded-lg bg-neutral-600 p-12 shadow-xl"
    >
      <Autocomplete />
      {/* <ArkAutocomplete /> */}
    </form>
  );
}
