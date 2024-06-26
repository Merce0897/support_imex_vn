import { NextResponse } from "next/server";
import { format } from "date-fns";
import { callCreateNewChemical } from "@/lib/puppeteer";

type ResponseData = {
  message: string;
};
export async function POST(request: Request) {
  const data = await request.json();
  const filterData = {
    invoice: data.inv,
    exportCompany: data.exCom,
    exportDate: format(data.invDt, "dd/MM/yyyy"),
    exportCountry: data.exCtry.id + 1,
    importGate: data.imGte.id + 1,
    invoiceURL: data.HDUrl.url,
    safetyURL: data.HCATUrl.url,
    item: data.ChemicalList.map((item: TChemicalItem) => {
      return {
        cas: item.casNo,
        hs: item.hsCd,
        name: item.itemNm,
        content: item.content.trim(),
        weight: item.weight.trim(),
        unit: (item.unit + 1).toString(),
        state: (item.state + 1).toString(),
        origin: (item.origin + 1).toString(),
        danger: (item.danger + 1).toString(),
        reason: (item.reason + 1).toString(),
        detail: item.detail,
      };
    }),
  };
  const res = await callCreateNewChemical(filterData);

  return NextResponse.json({ message: res }, { status: 200 });
}
