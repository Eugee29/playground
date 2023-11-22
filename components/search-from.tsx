"use client";

import Autocomplete from "@/components/autocomplete";

export default function SearchForm() {
  return (
    <form className="min-h-[600px] rounded-lg bg-neutral-600 p-12 shadow-xl">
      <Autocomplete />
    </form>
  );
}
