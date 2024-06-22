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
    ChemicalList: ChemicalItem[]
}

type ChemicalItem = {
    casNo: string
    itemNm: string
    hsCd: string
    content: string
    weight: string
    unit: number
    state: number
    origin: number
    danger: number
    reason: number
    detail: string
}



const url = process.env.chemical_declare_url

function Page() {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [casList, setCasList] = useState([])
    const [dangerList, setDangerList] = useState([])

    const [country, setCountry] = useState(0)
    const [gate, setGate] = useState(0)

    const form = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data)
    }

    return (
        <div className='mx-auto h-[100vh] flex justify-center items-center bg-indigo-200 '>
            <div className='w-1/2'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 full">
                        <div className='flex gap-5 w-full'>
                            <FormField
                                control={form.control}
                                name="inv"
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
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormLabel>File Hóa đơn</FormLabel>
                                        <FormControl>
                                            <UploadFile {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="HDUrl"
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormLabel>File An toàn hóa chất</FormLabel>
                                        <FormControl>
                                            <UploadFile {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <h2>Danh sách hàng</h2>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>

        </div>
    )
}

export default Page