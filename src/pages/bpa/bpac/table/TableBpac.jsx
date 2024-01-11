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
import loadingSvg from "../../../../assets/images/svg/loading.svg";
import HeaderTable from "./HeaderTable";
import EnhancedTableHead from "./EnhancedTableHead";

export default function TableBpac({ identifier }) {
  const [bpacList, setBpacList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);


  useEffect(() => {
    apiGetBPAC();
  }, [page, size]);

  async function apiGetBPAC() {
    setLoading(true);
    try {
      const response = await api.get(`/bpac/get/${identifier}?page=${page > 0 ? page - 1 : page}&size=${size}`);
      setBpacList(response.data.content);
      setTotalPage(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch(e) {
      console.log("Erro: ", e.response);
    }
    setLoading(false);
  }

  function handleChangePage(_event, value) {
    setPage(value);
  }

  function handleChangeSize(event) {
    setSize(event.target.value);
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
          <HeaderTable />
          <TableContainer>
              <Table
                sx={{ minWidth: 1200 }}
                aria-labelledby="tableTitle"
                size={'medium'}
              >
                <EnhancedTableHead />
                {
                  !(identifier == '') && !loading &&
                    <TableBody>
                      { bpacList.map((bpac, index) => (
                            <TableRow
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                            >
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.cnes)}</TableCell>
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.cmp)}</TableCell>
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.cbo)}</TableCell>
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.flh)}</TableCell>
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.seq)}</TableCell>
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.pa)}</TableCell>
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.idade)}</TableCell>
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.qt)}</TableCell>
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.org)}</TableCell>
                              <TableCell align="center">{hasOnlyWhitEspace(bpac.fim)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                }
              </Table>
              {
                identifier == '' || loading &&
                  <div className='flex justify-center my-2'>
                    <img src={loadingSvg} alt="loading..." width={50}/>
                  </div>
              }
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