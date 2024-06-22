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
};

type TSWCas = {
  fiCongThucHH: string;
  fiCreatedBy: null;
  fiCreatedDate: null;
  fiDmCASID: number;
  fiMaCAS: string;
  fiMaHS: number;
  fiTenIUPAC: string;
  fiTenThuongMai: string;
  fiUpdatedBy: null;
  fiUpdatedDate: null;
};

type TCountry = {
  fiCreatedDate: null;
  fiCreatedBy: null;
  fiUpdatedDate: null;
  fiUpdatedBy: null;
  fiQuocGiaID: number;
  fiQuocGiaCode: string;
  fiStateName: string;
  fiModifiedDate: null;
  fiIsDelete: string;
  fiRole: number;
  fiDescription: null;
  fiQuocGiaNameVi: string;
};

type TGate = {
  fiCreatedDate: null;
  fiCreatedBy: null;
  fiUpdatedDate: null;
  fiUpdatedBy: null;
  fiGateID: number;
  fiGateCode: string;
  fiGateName: string;
  fiCustomDeptCode: null;
  fiProvinceCode: null;
  fiNationCode: null;
  fiModifyDate: null;
  fiIsDeleted: string;
  fiRole: number;
};

type TDanger = {
  dangerId: number;
  fiMaXLNguyHiem: string;
  fiTenXLNguyHiem: string;
};

type TSelect = {
  id: number;
  value: string;
  label: string;
};
