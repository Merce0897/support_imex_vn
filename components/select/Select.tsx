"use client"

import React, { ReactElement, ReactNode, useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "../spinner/Spinner"
import { ControllerRenderProps } from "react-hook-form"

const url = process.env.NEXT_PUBLIC_CHEMICAL_DECLARE_URL

export function ComboboxDemo({ query, value, onChange, icons, ...rest }: {
    query: string
    value: {
        id: number
        value: string
    } | undefined;
    icons?: ReactElement
    onChange: (value: ({
        id: number
        value: string
    })) => void;
}) {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<TSelect[]>([])
    const available = items?.length

    useEffect(() => {
        let isCall = true
        const fetchData = (query: string) => {
            const current = Date.now();
            if (!isCall) return
            fetch(`${url}${query}?_=${current}`)
                .then((res) => res.json())
                .then((data) => {
                    let result = data.data;
                    if (query === "cuakhau")
                        result = result.filter(
                            (item: TGate) => item.fiGateCode.substring(0, 2) === "VN"
                        );
                    for (let i = 0; i < result.length; i++) {
                        switch (query) {
                            case 'quocgia':
                                setItems((prev: TSelect[]) => [...prev, {
                                    id: i + 1,
                                    value: result[i].fiQuocGiaCode,
                                    label: result[i].fiQuocGiaNameVi

                                }])
                                break;

                            case 'cuakhau':
                                setItems((prev: TSelect[]) => [...prev, {
                                    id: i + 1,
                                    value: result[i].fiGateCode,
                                    label: result[i].fiGateName

                                }])
                                break;
                            case 'nguyhiem':
                                setItems((prev: TSelect[]) => [...prev, {
                                    id: i + 1,
                                    value: result[i].fiMaXLNguyHiem,
                                    label: result[i].fiTenXLNguyHiem

                                }])
                                break;
                        }
                    }

                });
        };

        fetchData(query)

        return () => {
            isCall = false
        }
    }, [])



    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn({ 'justify-between': available, 'opacity-50 cursor-wait': !available }, 'w-full')}
                >
                    {
                        items?.length ? (
                            <span className="flex justify-between w-full">
                                {value ? items.find((item) => item.value === value?.value)?.label : "Chọn..."}
                                {
                                    icons ?
                                        (
                                            icons
                                        )
                                        :
                                        (
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        )
                                }

                            </span>
                        )
                            : (
                                <span className="flex">
                                    <Spinner size='small' className="mr-2" />
                                    Đang tải...
                                </span>
                            )
                    }

                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <Command>
                    <CommandInput placeholder="Tìm kiếm..." />
                    <CommandEmpty>Không có kết quả tìm kiếm</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.label}
                                    onSelect={() => {
                                        console.log(item);

                                        if (value?.value !== item.value) onChange({
                                            id: item.id,
                                            value: item.value
                                        });
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value?.value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                </Command>
            </PopoverContent>
        </Popover >
    )
}
