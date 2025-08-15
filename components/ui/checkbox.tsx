import * as React from "react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean | "indeterminate") => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, className = "", id, ...props }, ref) => {
    React.useEffect(() => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.indeterminate = checked === "indeterminate"
      }
    }, [checked, ref])

    return (
      <label className={`inline-flex items-center cursor-pointer ${className}`} htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          ref={ref}
          checked={checked === true}
          aria-checked={checked}
          onChange={e => {
            if (onCheckedChange) {
              onCheckedChange(e.target.indeterminate ? "indeterminate" : e.target.checked)
            }
          }}
          className="peer sr-only"
          {...props}
        />
        <span
          className={`w-4 h-4 flex items-center justify-center border rounded transition-colors duration-200
            border-gray-300 bg-white peer-checked:bg-houselook-cyan peer-checked:border-houselook-cyan
            peer-focus:ring-2 peer-focus:ring-houselook-cyan
            ${checked === "indeterminate" ? "bg-houselook-cyan/50 border-houselook-cyan" : ""}
          `}
        >
          {checked === true && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 8l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {checked === "indeterminate" && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="8" x2="12" y2="8" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox" 