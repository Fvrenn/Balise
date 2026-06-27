"use client"

import { Check, Filter } from "lucide-react"
import type { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export interface FacetedFilterOption {
  label: string
  value: string
}

interface FacetedFilterButtonProps {
  title: string
  options: FacetedFilterOption[]
  value: string[]
  onChange: (value: string[]) => void
}

export function FacetedFilterButton({
  title,
  options,
  value,
  onChange,
}: FacetedFilterButtonProps) {
  const selected = new Set(value)

  function toggle(opt: string) {
    const next = new Set(selected)
    if (next.has(opt)) next.delete(opt)
    else next.add(opt)
    onChange(Array.from(next))
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-dashed bg-white"
          />
        }
      >
        <Filter className="h-3.5 w-3.5" />
        {title}
        {selected.size > 0 && (
          <>
            <Separator orientation="vertical" className="mx-0.5 h-4" />
            <Badge
              variant="secondary"
              className="rounded-sm px-1.5 font-normal"
            >
              {selected.size}
            </Badge>
          </>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-44 p-1" align="start">
        <div className="flex flex-col gap-0.5">
          {options.map((option) => {
            const isSelected = selected.has(option.value)
            return (
              <button
                key={option.value}
                onClick={() => toggle(option.value)}
                className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:bg-accent"
              >
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input",
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
                <span>{option.label}</span>
              </button>
            )
          })}

          {selected.size > 0 && (
            <>
              <Separator className="my-0.5" />
              <button
                onClick={() => onChange([])}
                className="flex w-full cursor-default items-center justify-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:bg-accent"
              >
                Effacer les filtres
              </button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  options: FacetedFilterOption[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const value = (column.getFilterValue() as string[] | undefined) ?? []

  return (
    <FacetedFilterButton
      title={title}
      options={options}
      value={value}
      onChange={(next) =>
        column.setFilterValue(next.length > 0 ? next : undefined)
      }
    />
  )
}
