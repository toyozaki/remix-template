import { ButtonHTMLAttributes, ReactNode } from 'react'

import clsx from 'clsx'

import { Processing } from './Processing'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

type Props = {
  size?: 'small' | 'medium' | 'large'
  variant?: 'outlined' | 'containerd'
  loading?: boolean
  children: ReactNode
  className?: string
} & ButtonProps

export const Button = ({
  size = 'medium',
  variant = 'outlined',
  disabled = false,
  loading = false,
  children,
  className,
  ...props
}: Props) => {
  return (
    <button
      className={clsx(
        'flex-initial',
        size === 'small'
          ? 'py-1 px-2 text-xs'
          : size === 'medium'
          ? 'py-1.5 px-4 text-base'
          : 'py-2 px-6 text-lg',
        variant === 'outlined'
          ? `text-blue-400 hover:text-blue-500 rounded-md border-2 border-blue-400 hover:border-blue-500 ${
              disabled ? '' : 'active:text-blue-600 active:border-blue-600'
            }`
          : `text-white bg-blue-400 hover:bg-blue-500 rounded-md ${
              disabled ? '' : 'active:bg-blue-600'
            }`,
        className
      )}
      disabled={disabled}
      {...props}
    >
      <div className="flex justify-center content-center">
        {loading && <Processing />}
        {children}
      </div>
    </button>
  )
}
