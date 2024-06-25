import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export function UploadFile({ type, value, onChange, name, onBlur }: ({
    type: string,
    value: {
        url: string
        name: string
    },
    onChange: (value: ({
        url: string
        name: string
    })) => void,
    name: string,
    onBlur: () => void
})) {

    const uploadAttachment = async (type: string, file: File) => {
        const { data, error } = await supabase
            .storage
            .from('attachment_chemical')
            .upload(`${type}/${file.name}`, file, {
                cacheControl: '3600',
                upsert: false
            })
        if (!data) {
            alert('Có lỗi xảy ra. Vui lòng liên hệ Vinh nhé')
            return
        }
        onChange({
            url: data.path,
            name: file.name
        })
        console.log('Create FILE success');

    }

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="picture" type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                    console.log('Selected file:', files[0]);
                    uploadAttachment(type, files[0])

                }
            }} />
        </div>
    )
}