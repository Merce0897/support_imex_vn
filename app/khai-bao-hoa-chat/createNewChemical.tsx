import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { CircleX, ChevronDown } from "lucide-react"
import { Spinner } from "@/components/spinner/Spinner"
import { ComboboxDemo } from "@/components/select/Select"

type TCasSelect = TSelect & {
    formula: string
}

const unitSelection = [
    { id: 1, value: 'Mili lít' },
    { id: 2, value: 'Lít' },
    { id: 3, value: 'Gam' },
    { id: 4, value: 'Kilogam' },
    { id: 5, value: 'Tấn' },
    { id: 6, value: 'M3' },
    { id: 7, value: 'Mili Gram' },
    { id: 8, value: 'Centimet Khổi' },
    { id: 9, value: 'Decimet Khối' },
]

const stateSelection = [
    { id: 1, value: 'Rắn' },
    { id: 2, value: 'Lỏng' },
    { id: 3, value: 'Khí' },
]

const reasonSelection = [
    { id: 1, value: 'Sử dụng' },
    { id: 2, value: 'Kinh doanh trong lĩnh vực công nghiệp' },
    { id: 3, value: 'Kinh doanh trong lĩnh vực khác' }
]

const url = process.env.NEXT_PUBLIC_CHEMICAL_DECLARE_URL

const Selector = ({ items, onChange }: { items: { id: number; value: string }[], onChange: (id: number) => void }) => {

    const handleChange = (e: string) => {
        onChange(parseInt(e))
    }
    return (
        <Select onValueChange={handleChange}>
            <SelectTrigger className="pl-4 hover:bg-accent font-medium focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
                {
                    items.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>{item.value}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}

const CasSelector = ({ onChange }: {
    onChange: (item: { id: number; value: string }) => void
}) => {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<TCasSelect[]>([])
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
                    for (let i = 0; i < result.length; i++) {
                        setItems((prev: TCasSelect[]) => [...prev, {
                            id: i + 1,
                            value: result[i].fiTenIUPAC,
                            label: result[i].fiMaCAS,
                            formula: result[i].fiCongThucHH
                        }])
                    }

                });
        };

        fetchData('cas')

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
                    className={cn({ 'justify-between': available, 'opacity-50 cursor-wait': !available }, 'w-full col-span-3')}
                >
                    {
                        items?.length ? (
                            <span className="flex justify-between w-full">
                                Chọn...
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.label}
                                    className=""
                                    onSelect={() => {
                                        onChange({
                                            id: item.id,
                                            value: item.label
                                        })
                                        setOpen(false)

                                    }}
                                >
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

export function DialogDemo({ value, onChange, ...rest }: { value: TChemicalItem[], onChange: (newItem: TChemicalItem[]) => void }) {
    const [open, setOpen] = useState(false)
    const [casList, setCasList] = useState<{
        id: number
        value: string
    }[]>([])
    const [name, setName] = useState('')
    const [hs, setHs] = useState('')
    const [content, setContent] = useState('')
    const [weight, setWeight] = useState('')
    const [detail, setDetail] = useState('')
    const [unit, setUnit] = useState(0)
    const [state, setState] = useState(0)
    const [origin, setOrigin] = useState<{
        id: number
        value: string
    }>()
    const [danger, setDanger] = useState<
        {
            id: number
            value: string
        }>()
    const [reason, setReason] = useState(0)

    const handleChange = (item: { id: number; value: string }) => {
        setCasList(prev => [...prev, { id: item.id, value: item.value }]);
    };

    const removeItem = (id: number) => {
        setCasList(casList.filter(item => item.id !== id))
    }

    const handleAddItem = (item: TChemicalItem) => {
        value ? onChange([...value, item]) : onChange([item])

    };

    const resetData = () => {
        setCasList([])
        setName('')
        setHs('')
        setContent('')
        setWeight('')
        setDetail('')
        setUnit(0)
        setState(0)
        setReason(0)
        setOrigin({
            id: 0,
            value: ''
        })
        setDanger({
            id: 0,
            value: ''
        })
    }

    const saveChanges = () => {
        console.log(casList, name, hs, content, weight, detail, origin, danger, unit, state, reason);
        if (!origin || !danger) {
            alert('Oops, liên hệ Vinh nhé')
            return
        }
        const newItem = {
            id: (value?.length || 0) + 1,
            casNo: casList,
            itemNm: name,
            hsCd: hs,
            content: content,
            weight: weight,
            unit: unit,
            state: state,
            origin: origin.id,
            danger: danger.id,
            reason: reason,
            detail: detail,
        }
        handleAddItem(newItem)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p>Danh sách hàng <Button variant="default" className="py-1.5 h-min px-2.5 bg-indigo-500 hover:bg-indigo-400 hover:cursor-pointer">+</Button></p>
            </DialogTrigger>
            <DialogContent className="px-10 max-w-none w-1/3" onScroll={() => console.log('scroll')}>
                <DialogHeader>
                    <DialogTitle>Thông tin hóa chất</DialogTitle>
                </DialogHeader>
                <Carousel>
                    <CarouselContent>
                        <CarouselItem key={1} className="flex justify-center">
                            <div className="grid gap-4 py-4 w-full">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="cas" className="text-right">
                                        Mã CAS
                                    </Label>
                                    <CasSelector onChange={handleChange} />
                                </div>
                                <div className="row-span-2 items-center flex gap-2">
                                    <div className="h-full flex items-start">
                                        <h2>Danh sách đã chọn:</h2>
                                    </div>
                                    <ul className=" row-span-2 h-full flex flex-col">
                                        {
                                            casList.map(item => (<li key={item.id} className="flex w-full ">
                                                {item.value}
                                                <CircleX onClick={() => removeItem(item.id)} className="ml-2 hover:cursor-pointer" size={20} />
                                            </li>))
                                        }
                                    </ul>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Tên TM
                                    </Label>
                                    <Input
                                        autoComplete='off'
                                        id="name"
                                        className="col-span-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="hsCode" className="text-right">
                                        Mã HS
                                    </Label>
                                    <Input
                                        autoComplete='off'
                                        id="hsCode"
                                        className="col-span-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        value={hs}
                                        onChange={(e) => setHs(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="content" className="text-right">
                                        Hàm lượng
                                    </Label>
                                    <Input
                                        autoComplete='off'
                                        id="content"
                                        className="col-span-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="weight" className="text-right">
                                        Khối lượng
                                    </Label>
                                    <Input
                                        autoComplete='off'
                                        id="weight"
                                        className="col-span-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem key={2}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Đơn vị tính
                                    </Label>
                                    <div className="col-span-3">
                                        <Selector items={unitSelection} onChange={setUnit} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Trạng thái
                                    </Label>
                                    <div className="col-span-3">
                                        <Selector items={stateSelection} onChange={setState} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Xuất xứ
                                    </Label>
                                    <div className="col-span-3">
                                        <ComboboxDemo icons={<ChevronDown size={20} />} query='quocgia' value={origin} onChange={setOrigin} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        XL nguy hiểm
                                    </Label>
                                    <div className="col-span-3">
                                        <ComboboxDemo icons={<ChevronDown size={20} />} query='nguyhiem' value={danger} onChange={setDanger} />
                                    </div>

                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Mục đích nhập khẩu
                                    </Label>
                                    <div className="col-span-3">
                                        <Selector items={reasonSelection} onChange={setReason} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="detail" className="text-right">
                                        Chi tiết mục đích nhập khẩu
                                    </Label>
                                    <Textarea
                                        autoComplete='off'
                                        id="detail"
                                        className="col-span-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        value={detail}
                                        onChange={(e) => setDetail(e.target.value)}
                                    />
                                </div>
                                <a onClick={saveChanges} className="bg-indigo-500 rounded text-white text-center py-3 hover:cursor-pointer hover:bg-indigo-600">Save changes</a>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <div className="w-full h-10"></div>
                    <CarouselPrevious className="left-10 top-full text-white bg-indigo-500 hover:bg-indigo-600 hover:text-white" />
                    <CarouselNext className="right-10 top-full text-white bg-indigo-500 hover:bg-indigo-600 hover:text-white" />
                </Carousel>

                <DialogFooter>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}