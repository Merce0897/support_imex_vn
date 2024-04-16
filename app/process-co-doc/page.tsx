'use client'

import React, { useEffect, useState } from 'react'
import { read, utils, write } from 'xlsx'
import JSZip from 'jszip'


const ProcessCoDoc = () => {

    const printMaterialRegexp = /^\d{4}[A-Z]$/

    const readFile = async(e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = async (e) => {
            if (!e.target) return
            const data = e.target.result
            
            const wb = read(e.target.result)
            const ws = wb.Sheets["NHAP ECOSY"]
            const sheetNames = wb.SheetNames

            const zip = new JSZip();

            Object.entries(ws).map(item => {
                if (item[0][0] === 'B' && printMaterialRegexp.test(item[1].v.slice(0, 5))) {
                    let rootName = findInSheets(item[1].v, sheetNames)
                    if (!rootName) return
                    const worksheet = wb.Sheets[rootName];
                    
                    const sheetData = utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
                    
                    // Create a new workbook
                    const newWorkbook = utils.book_new();
                    utils.book_append_sheet(newWorkbook, utils.aoa_to_sheet(sheetData), rootName);
    
                    // Write the workbook to a buffer
                    const buffer = write(newWorkbook, { type: 'array', bookType: 'xlsx' });
    
                    // Add the buffer to the zip file
                    zip.file(`${rootName}.xlsx`, buffer);
                }
            })
            // Generate the zip file
            const content = await zip.generateAsync({ type: 'blob' });

            // Create a link to download the zip file
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'output.zip';
            link.click();
            
        }
        reader.readAsArrayBuffer(file)
    }
    
    const findInSheets = (raw: string, sheets: string[]) => {
        for (const sheet of sheets) {
            if (sheet.includes(raw)) return sheet
        }
    }

  return (
    <div className='px-10'>
        <h2>PROCESS CO</h2>
        <input type="file" onChange={readFile} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    </div>
  )
}

export default ProcessCoDoc