"use client"

import Accordion from "@/components/accordion"

export default function AccordionDemo() {
  return (
    <Accordion.Root className="w-full max-w-md rounded border bg-white px-2 shadow">
      <Accordion.Item
        className="border-b px-3 py-2 last:border-none"
        value="item-1"
      >
        <Accordion.Trigger className="font-bold">
          Is it accessible?
        </Accordion.Trigger>
        <Accordion.Content className="mt-2">
          Yes. It adheres to the WAI-ARIA design pattern.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item
        className="border-b px-3 py-2 last:border-none"
        value="item-2"
      >
        <Accordion.Trigger className="font-bold">
          Is it unstyled?
        </Accordion.Trigger>
        <Accordion.Content className="mt-2">
          Yes. unstyled by default, giving you freedom over the look and feel.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item
        className="border-b px-3 py-2 last:border-none"
        value="item-3"
      >
        <Accordion.Trigger className="font-bold">
          Can it be animated?
        </Accordion.Trigger>
        <Accordion.Content className="mt-2">
          Yes! You can animate the Accordion with CSS or JavaScript.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
