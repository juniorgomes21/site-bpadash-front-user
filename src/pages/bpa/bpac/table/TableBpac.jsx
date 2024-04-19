import React, { useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Pagination from "@mui/material/Pagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import api from "../../../../services/api";
import loadingSvg from "../../../../assets/images/svg/loading.svg";
import HeaderTable from "./HeaderTable";
import EnhancedTableHead from "./EnhancedTableHead";
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from '@mui/icons-material/Settings';
import { maskCmp, maskPa } from "../../../../Validation&Formatation/formatation";
import DateGlobalBpaContext from "../../../../contexts/DateGlobalBpa";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogBpac from "./DialogBpac";
import WarningIcon from '@mui/icons-material/Warning';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import AlertCustom from "../../../../GlobalComponents/AlertCustom";


const names = [
    "cnes",
    "cmp",
    "cbo",
    "flh",
    "seq",
    "pa",
    "idade",
    "qt",
    "org",
    "fim",
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function TableBpac({ identifier }) {

    const { getFormattedDate } = useContext(DateGlobalBpaContext);

    const [bpacList, setBpacList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [open, setOpen] = useState(false);
    const [tablesVisibleStorage, setTablesVisibleStorage] = useState(JSON.parse(localStorage.getItem("@TablesVisibleBpac")));
    const [filterTableStorage, setFilterTableStorage] = useState(JSON.parse(localStorage.getItem("@FilterTableBpac")));

    useEffect(() => {
        // let tablesVisible = [
        //     { cnes: true },
        //     { cmp: true },
        //     { cbo: true },
        //     { flh: true },
        //     { seq: true },
        //     { pa: true },
        //     { idade: true },
        //     { qt: true },
        //     { org: true },
        //     { fim: true },
        // ];
        // localStorage.setItem("@TablesVisibleBpac", JSON.stringify(tablesVisible));
        apiGetBPAC();
    }, [page, size]);

    useEffect(() => {
        apiGetBPAC();
    }, [filterTableStorage]);

    async function apiGetBPAC() {
        setLoading(true);
        try {
            const response = await api.post(`/bpac/get/${getFormattedDate()}?page=${ page > 0 ? page - 1 : page }&size=${size}`, filterTableStorage);
            setBpacList(response.data.content);
            setTotalPage(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (e) {
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

    function auxMask(field, value) {
        switch (field) {
            case "pa":
                return maskPa(value);
            case "cmp":
                return maskCmp(value, false);

            default:
                return /^\s*$/.test(value) ? "Em branco" : value;
        }
    }

    function handleOpenDialog() {
        setOpen(true);
    }
    
    function handleSalve() {
        setTablesVisibleStorage(JSON.parse(localStorage.getItem("@TablesVisibleBpac")));
        setFilterTableStorage(JSON.parse(localStorage.getItem("@FilterTableBpac")));
        setOpen(false);
    }

    function handleCloseDialog() {
        setOpen(false);
    }

    function haveFilter() {
        const defaultObj = { pa: "", cnes: "", cnsmed: "", cbo: "", ibge: "", sex: "", race: "00" };
    
        // Verifica se o número de chaves nos dois objetos é o mesmo
        if (Object.keys(filterTableStorage).length !== Object.keys(defaultObj).length) {
            return true;
        }
    
        // Verifica se as chaves e os valores são os mesmos em ambos os objetos
        for (let chave in defaultObj) {
            if (defaultObj.hasOwnProperty(chave)) {
                if (filterTableStorage[chave] !== defaultObj[chave]) {
                    return true;
                }
            }
        }
    
        // Se todas as chaves e valores forem iguais, retorna falso
        return false;
    }


    return (
        <>
            <div className="w-full">
                <Paper sx={{ width: "100%", mb: 2 }}>
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
                            BPA-C
                        </Typography>
                        {
                            haveFilter() &&
                                <Tooltip title="Filtro BPAI ativo" placement="top" className="mr-2">
                                    <div className="cursor-pointer">
                                        <WarningIcon className="text-orange-500"/>
                                    </div>
                                </Tooltip>
                        }
                        <Link to={`/file/edit/bpai`}>
                            <IconButton>
                                <EditIcon color="primary" />
                            </IconButton>
                        </Link>
                        <IconButton onClick={handleOpenDialog}>
                            <SettingsIcon sx={{ color: "white"}} />
                        </IconButton>
                    </Toolbar>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 1200 }}
                            aria-labelledby="tableTitle"
                            size={"medium"}
                        >
                            <EnhancedTableHead
                                names={names}
                                tablesVisibleStorage={tablesVisibleStorage}
                            />
                            {!(identifier == "") && !loading && (
                                    <TableBody>
                                        {
                                            bpacList.map((bpac, index) => (
                                                <TableRow
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={index}
                                                >
                                                    {names.map((name, index) => (
                                                        tablesVisibleStorage[index][name] && (
                                                            <TableCell
                                                                key={index}
                                                                align="center"
                                                                className="truncate"
                                                            >
                                                                {auxMask(name, bpac[name])}
                                                            </TableCell>
                                                        )
                                                    ))}
                                                </TableRow>
                                        ))}
                                    </TableBody>
                            )}
                        </Table>
                    </TableContainer>
                    {
                        (identifier == "" || loading) ?
                            <div className="flex justify-center">
                                <img
                                    src={loadingSvg}
                                    alt="loading..."
                                    width={50}
                                    className="my-10"
                                />
                            </div>
                        :
                            bpacList.length > 0 ?
                                <div className="flex justify-center py-4">
                                    <div className="max-sm:flex-col flex justify-between items-center w-[98%]">
                                        <div className="w-32 max-sm:mb-6">
                                            <FormControl fullWidth size="small">
                                                <InputLabel id="demo-simple-select-label">
                                                    Elementos
                                                </InputLabel>
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
                                        <Pagination
                                            size="small"
                                            count={totalPage}
                                            page={page == 0 ? 1 : page}
                                            onChange={handleChangePage}
                                            color="primary"
                                        />
                                        <div className="max-sm:mt-6">
                                            <p>Total de elementos: {totalElements}</p>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="flex justify-center w-full py-10">
                                    <AlertCustom
                                        msg={"Nenhum registro BPAC encontrado."}
                                        type={"info"}
                                    />
                                </div>
                    }
                </Paper>
            </div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleCloseDialog}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }} className="!bg-default">
                    <Toolbar>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={handleCloseDialog}
                        >
                            Fechar
                        </Button>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        </Typography>
                        <Button
                            autoFocus
                            variant="contained"
                            color="success"
                            onClick={handleSalve}
                        >
                            salvar
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogBpac />
            </Dialog>
        </>
    );
}
