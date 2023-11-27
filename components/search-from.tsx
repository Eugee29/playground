"use client";

import Autocomplete from "@/components/autocomplete";
import ArkAutocomplete from "@/components/autocomplete-ark";

export default function SearchForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Autocomplete />
      {/* <ArkAutocomplete /> */}
    </form>
  );
}
