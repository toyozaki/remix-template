import { TextareaHTMLAttributes } from 'react'

import clsx from 'clsx'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

type Props = Omit<TextareaProps, 'name'> & {
  name: string
  label?: string
  resizable?: boolean
  className?: string
}

export const Textarea = ({
  className,
  name,
  label,
  resizable,
  rows = 3,
  ...textareaProps
}: Props) => {
  return (
    <div className={className}>
      <label className="flex flex-row justify-center">
        <span className="flex flex-col justify-center">{label}</span>
        <textarea
          className={clsx(
            'flex-1 p-2 rounded-md border border-gray-300',
            !resizable && 'resize-none',
            label !== undefined && label?.length > 0 && 'ml-4'
          )}
          name={name}
          rows={rows}
          {...textareaProps}
        />
      </label>
    </div>
  )
}
