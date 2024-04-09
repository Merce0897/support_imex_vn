declare module "*.json" {
    const value: any;
    export default value;
  }
type TCas = {
    Id: string;
    CasNumber: number;
    TenQuocTe: string;
    TenTiengViet: string;
    NciNo: null | string;
    Cas: string;
    HSCode: null | string;
    QD: null | string[];
}