interface Props {
  copyright?: string
  className?: string
}

export const Copyright = ({ copyright = '© 2022 toyozaki', className }: Props) => {
  return (
    <div className={className}>
      <small>{copyright}</small>
    </div>
  )
}
