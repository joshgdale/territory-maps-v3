import { type ReactNode } from 'react'

interface IColumnLayout {
  children: ReactNode
}

export function ColumnLayout(props: IColumnLayout) {
  return <div className="grid gap-4 md:grid-cols-2 md:gap-6">{props.children}</div>
}

interface IColumn {
  children: ReactNode
}

function Column(props: IColumn) {
  return <div className="flex flex-col gap-4 md:gap-6">{props.children}</div>
}

ColumnLayout.Column = Column
