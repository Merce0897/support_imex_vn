import { Input } from "@/components/ui/input"

export function UploadFile({ value, onChange, name, onBlur }: ({
    value: {
        url: string
        name: string
    },
    onChange: (value: {
        url: string
        name: string
    }) => void,
    name: string,
    onBlur: () => void
})) {

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="picture" type="file" />
        </div>
    )
}