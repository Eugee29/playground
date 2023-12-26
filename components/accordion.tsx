import { createContext, useContext, useState } from "react"

type ValueType = string | number

const AccordionContext = createContext<{
  activeValue: ValueType | null
  setActiveValue: React.Dispatch<React.SetStateAction<ValueType | null>>
} | null>(null)

const useAccordion = () => {
  const context = useContext(AccordionContext)
  if (!context)
    throw new Error("Accordion must be used within a AccordionProvider")
  return context
}

const ItemContext = createContext<{
  value: ValueType
} | null>(null)

const useItem = () => {
  const context = useContext(ItemContext)
  if (!context) throw new Error("Item must be used within a ItemProvider")
  return context
}

type AccordionRootProps = React.ComponentProps<"div">

const Root = (props: AccordionRootProps) => {
  const [activeValue, setActiveValue] = useState<ValueType | null>(null)

  return (
    <AccordionContext.Provider value={{ activeValue, setActiveValue }}>
      <div {...props} />
    </AccordionContext.Provider>
  )
}

type AccordionItemProps = React.ComponentProps<"div"> & { value: ValueType }

const Item = ({ value, ...props }: AccordionItemProps) => {
  return (
    <ItemContext.Provider value={{ value: value }}>
      <div {...props} />
    </ItemContext.Provider>
  )
}

type AccordionTriggerProps = React.ComponentProps<"button">

const Trigger = ({ onClick, ...props }: AccordionTriggerProps) => {
  const { setActiveValue } = useAccordion()
  const { value } = useItem()

  const handleClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick?.(ev)
    setActiveValue((prev) => (prev === value ? null : value))
  }

  return <button {...props} onClick={handleClick} />
}

type AccordionContentProps = React.ComponentProps<"div">

const Content = (props: AccordionContentProps) => {
  const { activeValue } = useAccordion()
  const { value } = useItem()

  const isActive = activeValue === value

  return isActive ? <div {...props} /> : null
}

const Accordion = {
  Root,
  Item,
  Trigger,
  Content,
}

export default Accordion
