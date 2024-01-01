import {
  Popper,
  UseAutocompleteProps,
  UseAutocompleteReturnValue,
  useAutocomplete,
} from "@mui/base"
import { unstable_useForkRef as useForkRef } from "@mui/utils"
import { createContext, useContext, useRef } from "react"

const AutocompleteContext = createContext<UseAutocompleteReturnValue<
  unknown,
  boolean,
  boolean,
  boolean
> | null>(null)

const useAutocompleteContext = () => {
  const context = useContext(AutocompleteContext)
  if (!context) {
    throw new Error(
      "useAutocomplete must be used within an AutocompleteProvider",
    )
  }
  return context
}

type RootProps = UseAutocompleteProps<unknown, boolean, boolean, boolean> & {
  children?: (
    props: UseAutocompleteReturnValue<unknown, boolean, boolean, boolean>,
  ) => React.ReactNode
}
const Root = ({ children, ...props }: RootProps) => {
  const autocomplete = useAutocomplete(props)
  const ref = useRef(null)
  const rootRef = useForkRef(ref, autocomplete.setAnchorEl)
  return (
    <AutocompleteContext.Provider value={autocomplete}>
      <div ref={rootRef} {...autocomplete.getRootProps()}>
        {children?.(autocomplete)}
      </div>
    </AutocompleteContext.Provider>
  )
}

type LabelProps = React.ComponentProps<"label">
const Label = (props: LabelProps) => {
  const { getInputLabelProps } = useAutocompleteContext()
  return <label {...props} {...getInputLabelProps()} />
}

type ClearProps = React.ComponentProps<"button">
const Clear = (props: ClearProps) => {
  const { getClearProps } = useAutocompleteContext()
  return <button {...props} {...getClearProps()} />
}

type TagProps = { index: number } & {
  children?: (props: {
    "data-tag-index": number
    tabIndex: -1
    onDelete: (event: any) => void
  }) => React.ReactNode
}
const Tag = ({ index, children }: TagProps) => {
  const { getTagProps } = useAutocompleteContext()
  const { key, ...tagProps } = getTagProps({ index })
  return children?.(tagProps)
}

type InputProps = React.ComponentProps<"input">
const Input = (props: InputProps) => {
  const { getInputProps } = useAutocompleteContext()
  return <input {...props} {...getInputProps()} />
}

type IndicatorProps = React.ComponentProps<"button">
const Indicator = (props: IndicatorProps) => {
  const { getPopupIndicatorProps } = useAutocompleteContext()
  return (
    <button
      aria-label="popup indicator"
      {...props}
      {...getPopupIndicatorProps()}
    />
  )
}

type ListProps = React.ComponentProps<"ul">
const List = (props: ListProps) => {
  const { popupOpen, anchorEl, getListboxProps } = useAutocompleteContext()
  return (
    <Popper open={popupOpen} anchorEl={anchorEl}>
      <ul
        style={{ width: anchorEl?.clientWidth }}
        {...props}
        {...getListboxProps()}
      />
    </Popper>
  )
}

type OptionProps = React.ComponentProps<"li"> & {
  option: unknown
  index: number
}
const Option = ({ option, index, ...props }: OptionProps) => {
  const { getOptionProps } = useAutocompleteContext()
  const { key, ...optionProps } = getOptionProps({ option, index }) as {
    key: React.Key
  }
  return <li {...props} {...optionProps} />
}

const Autocomplete = {
  Root,
  Label,
  Clear,
  Tag,
  Input,
  Indicator,
  List,
  Option,
}

export default Autocomplete
