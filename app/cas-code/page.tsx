"use client";

import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import {
  TextField,
  Table,
  TablePagination,
  Collapse,
  Typography,
  Switch,
  Box,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  SwitchProps,
  TableContainer,
  CircularProgress,
  TableRow,
  FormGroup,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { Search, KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import DataAPI from "@/json/cas.json";
import { useDebounce } from "@uidotdev/usehooks";
import Loading from "./loading";

type TData = {
  source: null | string;
  data: TCas[];
  total: number;
  aggregateResults: null | string;
  errors: null | string;
  model: null | string;
};

type TColumn = {
  key: string;
  name: string;
  dataKey: keyof TCas;
  width: number;
  align: "left" | "center" | "right" | "inherit" | "justify" | undefined;
};

const columns: TColumn[] = [
  { key: "column_cas", name: "Mã CAS", dataKey: "Cas", width: 100, align: 'left' },
  { key: "column_hscode", name: "HS Code", dataKey: "HSCode", width: 100, align: 'left' },
  {
    key: "column_document",
    name: "Thủ tục liên quan",
    dataKey: "QD",
    width: 200,
    align: 'left'
  },
  {
    key: "column_vietnamese_name",
    name: "Tên tiếng Việt",
    dataKey: "TenTiengViet",
    width: 300,
    align: 'center'
  },
  {
    key: "column_global_name",
    name: "Tên quốc tế",
    dataKey: "TenQuocTe",
    width: 300,
    align: 'center'
  },
];

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#6366f1',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const CasCode = () => {
  const data = DataAPI as TData;
  const [renderData, setRenderData] = useState<TCas[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [onlyDoc, setOnlyDoc] = useState(false)
  const [total, setTotal] = useState(data.total)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300);
  const [init, setInit] = useState(false)

  useEffect(() => {
    setRenderData(data.data);
    setInit(true)
  }, [data]);

  useEffect(() => {
    if (onlyDoc) setRenderData(data.data.filter(item => item.QD !== null).slice(page * 20, (page + 1) * 20));
    else setRenderData(data.data.slice(page * 20, (page + 1) * 20));
  }, [page])

  useEffect(() => {
    setPage(0)
    setSearch('')
    resetData(onlyDoc)
  }, [onlyDoc])

  useEffect(() => {
    const searchHN = () => {
      setLoading(true);
      if (debouncedSearch) {
        let results = data.data.filter(item => item.Cas.includes(search))
        if (onlyDoc) results = results.filter(item => item.QD !== null)

        setPage(0)
        setTotal(results.length)
        setRenderData(results.slice(0, 20))
      }
      setLoading(false);
    };

    searchHN();
  }, [debouncedSearch])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const resetData = (status: boolean) => {
    if (status) {
      const onlyDocData = data.data.filter(item => item.QD !== null)
      setTotal(onlyDocData.length)
      setRenderData(onlyDocData.slice(0, 20))
    }
    else {
      setTotal(data.total)
      setRenderData(data.data.slice(0, 20))
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.trim());
    if (!e.target.value) {
      resetData(onlyDoc)
    }
  };

  return (
    <div className="w-full px-8 py-10">
      <div className="flex mb-8">
        <TextField
          className="w-[40rem] bg-white"
          id="outlined-basic"
          label="Search by cas code"
          variant="outlined"
          value={search}
          onChange={handleSearch}
        />
        <div
          onClick={() => setLoading(!loading)}
          className={`border border-solid ml-4 border-gray-300 flex justify-center items-center w-16 rounded`}
        >
          {loading ? (
            <CircularProgress
              size={20}
              thickness={6}
              className="text-indigo-500"
            />
          ) : (
            <Search />
          )}
        </div>
      </div>
      <div>
        <FormGroup>
          <FormControlLabel control={<IOSSwitch sx={{ m: 1 }} onChange={() => setOnlyDoc(!onlyDoc)} checked={onlyDoc} />} label="Chọn các mã có phụ lục" />
        </FormGroup>
        {
          init ? (
            <CollapsibleTable data={renderData} />
          )
            :
            (
              <Loading />
            )
        }


      </div>
      <TablePagination
        count={total}
        page={page}
        rowsPerPage={20}
        component="div"
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
        align="right"
      />
    </div>
  );
};

const CollapsibleTable = ({ data }: { data: TCas[] }) => {
  return (
    <TableContainer component={Paper} sx={{ height: 600, width: '100%' }}>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {
              columns.map(column => (
                <TableCell width={column.width} align={column.align} className="bg-indigo-500 text-white" key={column.dataKey}>{column.name}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((cas, idx) => (
            <Row key={idx} row={cas} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  );
}

const Row = ({ row }: { row: TCas }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width={200}>
          {row.Cas}
        </TableCell>
        <TableCell align="right" width={100}>{row.HSCode}</TableCell>
        <TableCell width={100} align="center">
          {
            row.QD && (

              <IconButton
                aria-label="expand row"
                size="small"
                className="bg-red-200 hover:bg-red-100"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>

            )
          }
        </TableCell>

        <TableCell align="left" width={300}>{row.TenQuocTe}</TableCell>
        <TableCell align="left" width={300}>{row.TenTiengViet}</TableCell>
        {/* <TableCell align="right">{row.protein}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, marginBottom: 5 }}>
              {row.QD && row.QD.map((item, idx) => (
                <Typography key={idx} gutterBottom component="div">
                  {item}
                </Typography>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default CasCode;
