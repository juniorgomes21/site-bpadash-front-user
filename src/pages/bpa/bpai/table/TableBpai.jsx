import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Pagination from '@mui/material/Pagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import api from "../../../../services/api";
import HeaderTable from "./HeaderTable";
import TitleTable from "./TitleTable";

const names = [
  'cnes',
  'cmp',
  'cnsmed',
  'cbo',
  'dtaten',
  'flh',
  'seq',
  'pa',
  'cnspac',
  'sexo',
  'ibge',
  'cid',
  'idade',
  'qt',
  'caten',
  'naut',
  'org',
  'nmpac',
  'dtnasc',
  'raca',
  'etnia',
  'nac',
  'srv',
  'clf',
  'equipeSeq',
  'equipeArea',
  'cnpj',
  'cepPcnte',
  'logradPcnte',
  'endPcnte',
  'complPcnte',
  'numPcnte',
  'bairroPcnte',
  'ddtelPcnte',
  'emailPcnte',
  'ine',
  'fim'
];

export default function TableBpai({ identifier }) {

  const [open, setOpen] = useState(false);
  const [bpai, setBpai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    apiGetBPAI();
  }, [page, size]);

  async function apiGetBPAI() {
    setLoading(true);
    try {
      const responseBPAC = await api.get(`/bpai/get/${identifier}?page=${page > 0 ? page - 1 : page}&size=${size}`);
      setBpai(responseBPAC.data.content);
      setTotalPage(responseBPAC.data.totalPages);
      setTotalElements(responseBPAC.data.totalElements);
    } catch(e) {
      console.log("Erro: ", e.response);
    }
    setLoading(false);
  }

  function handleChangeSize(event) {
    setSize(event.target.value);
  }

  function handleChangePage(_event, value) {
    setPage(value);
  }

  function hasOnlyWhitEspace(str) {
    if(/^\s*$/.test(str)) {
      return "Em branco"
    }
  
    return str;
  }


  return (
    <div className='w-full'>
      <Paper sx={{ width: '100%', mb: 2 }}>
          <HeaderTable
            name={"BPA-I"}
            table="bpai"
            identifier={identifier}
          />
          <TableContainer>
              <Table
                  sx={{ minWidth: 1200 }}
                  aria-labelledby="tableTitle"
                  size={'medium'}
              >
                <TitleTable
                  names={names}
                />
                <TableBody>
                  { bpai.map((row, index) => (
                    <TableRow
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      {
                        names.map((name, index) => (
                          <TableCell key={index} align="center" className="truncate">
                            {hasOnlyWhitEspace(row[name])}
                          </TableCell>
                        ))
                      }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </TableContainer>
          <div className="flex justify-center py-4">
            <div className="max-sm:flex-col flex justify-between items-center w-[98%]">
              <div className="w-32 max-sm:mb-6">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Elementos</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={size}
                    label="Elementos"
                    onChange={handleChangeSize}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={200}>200</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Pagination size="small" count={totalPage} page={page == 0 ? 1 : page} onChange={handleChangePage} color="primary" />
              <div className="max-sm:mt-6">
                <p>Total de elementos: {totalElements}</p>
              </div>
            </div>
          </div>
      </Paper>
    </div>
  );
}