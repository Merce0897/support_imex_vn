import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

export function TableDemo({ value, ...rest }: { value: TChemicalItem[] }) {
    console.log(value)
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-indigo-500 hover:bg-indigo-400">
                    <TableHead className="w-[100px] text-white">STT</TableHead>
                    <TableHead className="text-white">Mã HS</TableHead>
                    <TableHead className="text-white">Mã CAS</TableHead>
                    <TableHead className="text-white">Tên TM</TableHead>
                    <TableHead className="text-right text-white">Tên TM</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="bg-indigo-100">
                {
                    value ? (
                        value.map((item) => {
                            let joinedCas = ''
                            item.casNo.map(item => joinedCas += `${item.value};`)
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.hsCd}</TableCell>
                                    <TableCell>{joinedCas}</TableCell>
                                    <TableCell>{item.itemNm}</TableCell>
                                    <TableCell className="text-right">sdsd</TableCell>
                                </TableRow >
                            )
                        }))
                        : (
                            <TableRow >
                                <TableCell className="text-center" colSpan={5}>Chưa có dữ liệu</TableCell>
                            </TableRow>
                        )
                }

            </TableBody >
        </Table >
    )
}
