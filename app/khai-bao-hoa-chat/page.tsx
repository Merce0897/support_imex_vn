'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ComboboxDemo } from '@/components/select/Select'
import { UploadFile } from '@/components/UploadFile/UploadFile'
import { TableDemo } from './table'
import { DialogDemo } from './createNewChemical'


type Inputs = {
    inv: string
    invDt: string
    exCom: string
    exCtry: {
        id: number
        value: string
    }
    imGte: {
        id: number
        value: string
    }
    HDUrl: {
        url: string,
        name: string
    }
    HCATUrl: {
        url: string,
        name: string
    }
    ChemicalList: TChemicalItem[]
}

function Page() {
    const [calendarOpen, setCalendarOpen] = useState(false);

    const form = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data)
        fetch('/api/khai-bao-hoa-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }

    return (
        <div className='mx-auto flex justify-center items-center '>
            <div className='w-1/2'>
                <div className='h-48 w-full' />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 full">
                        <div className='flex gap-5 w-full'>
                            <FormField
                                control={form.control}
                                name="inv"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormLabel>Số hóa đơn</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoComplete='off' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="invDt"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col justify-between flex-1">
                                        <FormLabel className='mt-1'>Ngày hóa đơn</FormLabel>
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={"pl-3 text-left font-normal"}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Chọn ngày</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    onSelect={(e) => {
                                                        field.onChange(e)
                                                        setCalendarOpen(false)
                                                    }}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="exCom"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Công ty xuất khẩu</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex gap-5 w-full'>
                            <FormField
                                control={form.control}
                                name="exCtry"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col justify-between flex-1">
                                        <FormLabel className='mt-1'>Quốc gia xuất khẩu</FormLabel>
                                        <ComboboxDemo query='quocgia'  {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="imGte"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col justify-between flex-1">
                                        <FormLabel className='mt-1'>Cửa khẩu nhập hóa chất</FormLabel>
                                        <ComboboxDemo query='cuakhau' {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <h2>Danh sách đính kèm</h2>
                        <div className='space-y-4'>
                            <FormField
                                control={form.control}
                                name="HDUrl"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormLabel>File Hóa đơn</FormLabel>
                                        <FormControl>
                                            <UploadFile type='invoice' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="HCATUrl"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormLabel>File An toàn hóa chất</FormLabel>
                                        <FormControl>
                                            <UploadFile type='safety' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="ChemicalList"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormControl>
                                            <DialogDemo {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <FormField
                            control={form.control}
                            name="ChemicalList"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormControl>
                                        <TableDemo {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
                <div className='h-48 w-full' />

            </div>

        </div>
    )
}

export default Page