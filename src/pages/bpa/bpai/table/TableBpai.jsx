import React, { useState, useEffect, useContext } from "react";
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
import TitleTable from "./TitleTable";
import { formatDateString, formatDateStringFull, maskCEP, maskCell, maskCmp, maskPa, maskPointThree } from "../../../../Validation&Formatation/formatation";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router-dom"
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import Tooltip from "@mui/material/Tooltip";
import DateGlobalBpaContext from "../../../../contexts/DateGlobalBpa";

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

    const { getFormattedDate } = useContext(DateGlobalBpaContext);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [bpai, setBpai] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        apiGet();
    }, [page, size]);

    async function apiGet() {
        setLoading(true);
        try {
            const responseBpac = await api.get(`/bpai/get/${getFormattedDate()}?page=${page > 0 ? page - 1 : page}&size=${size}`);
            setBpai(responseBpac.data.content);
            setTotalPage(responseBpac.data.totalPages);
            setTotalElements(responseBpac.data.totalElements);
        } catch (e) {
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

    function auxMask(field, value) {
        switch(field) {
            case 'pa': return maskPa(value);
            case 'cnsmed': return maskPointThree(value);
            case 'cmp': return maskCmp(value, false);
            case 'dtaten': return formatDateStringFull(value, true);
            case 'dtnasc': return formatDateStringFull(value, true);
            case 'ddtelPcnte': return maskCell(value);
            case 'cepPcnte': return maskCEP(value);
            case 'cnspac': return maskPointThree(value);

            default: return (/^\s*$/.test(value)) ? "Em branco" : value;
        }
    }
    
    return (
        <>
            <div className='w-full'>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 }
                        }}
                        className="bg-[#2a3042] text-white"
                    >
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            BPA-I
                        </Typography>
                        <Tooltip title="Filtro BPAI" placement="top" className="mr-2">
                            <div className="cursor-pointer">
                                <FilterListIcon />
                            </div>
                        </Tooltip>
                        <Link to={`/file/edit/bpai`}>
                            <IconButton>
                                <EditIcon color="primary" />
                            </IconButton>
                        </Link>
                    </Toolbar>
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
                                {bpai.map((row, index) => (
                                    <TableRow
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={index}
                                    >
                                        {
                                            names.map((name, index) => (
                                                <TableCell key={index} align="center" className="truncate">
                                                    {
                                                        auxMask(name, row[name])
                                                    }
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
        </>
    )
}
