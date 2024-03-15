import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import api from "../../services/api";
import SnackbarContext from "../../contexts/managerService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Pagination from "@mui/material/Pagination";
import loadingSvg from "../../assets/images/svg/loading.svg";
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { formatDate, formatDateAndHours, formatDateString } from "../../Validation&Formatation/formatation";
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const cells = [
    "Ação",
    "Detalhe",
    "Dia/hora",
    "Competência",
    "Funcionário",
    "Linhas Modificadas",
];

const list = [ "LOGIN", "LOGOUT", "DOWNLOAD", "UPDATE_EMPLOYEE", "UPDATE_PASSWORD"];
const ignoreLine = [ "LOGIN", "LOGOUT", "ADD", "DELETE", "DOWNLOAD", "UPDATE_EMPLOYEE", "UPDATE_PASSWORD"];

function HistoryActions(props) {
    document.title = "Histórico de ações";

    const { openSnackBarFun } = useContext(SnackbarContext);

    const [historyAction, setHistoryAction] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        apiGet();
    }, [page, size]);

    async function apiGet() {
        setLoading(true);
        try {
            const response = await api.get(`/history/get?page=${ page > 0 ? page - 1 : page }&size=${size}`);
            setHistoryAction(response.data.content);
            setTotalPage(response.data.totalPages);
            setTotalElements(response.data.totalElements);

        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    function handleChangePage(_event, value) {
        setPage(value);
    }

    function handleChangeSize(event) {
        setSize(event.target.value);
    }

    function IconPerType({ type }) {
        switch (type) {
            case 'UPDATE':
                return <EditIcon color="primary" />;
            case 'DELETE_LINE':
                return <DeleteSweepIcon color="error" />;
            case 'UPDATE_EMPLOYEE':
                return <ManageAccountsIcon color="primary" />;
            case 'UPDATE_PASSWORD':
                return <LockResetIcon color="warning" />;
            case 'ADD':
                return <UploadFileIcon color="success" />;
            case 'ADD_BPAC':
                return <UploadFileIcon color="success" />;
            case 'ADD_BPAI':
                return <UploadFileIcon color="success" />;
            case 'DELETE':
                return <DeleteForeverIcon color="error" />;
            case 'DOWNLOAD':
                return <CloudDownloadIcon color="success" />;
            case 'LOGIN':
                return <LoginIcon color="success" />;
            case 'LOGOUT':
                return <LogoutIcon color="warning" />;
            default:
                return "Erro Icon";
        }
      };

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title={props.t("Histórico de ações")}
                        breadcrumbItem={props.t("Histórico de ações")}
                    />
                    <div>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650 }}
                                size="small"
                                aria-label="a dense table"
                            >
                                <TableHead>
                                    <TableRow>
                                        {cells.map((cell, index) => (
                                            <TableCell key={index} align="center" className="uppercase !font-bold text-white bg-default">
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {   historyAction.map((history, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    align="center"
                                                >
                                                    <IconPerType type={history.type} />
                                                </TableCell>
                                                <TableCell align="center">
                                                    {history.action}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {formatDateAndHours(history.date)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        list.includes(history.type) ?
                                                            "-"
                                                        :
                                                            history.dateFile ? formatDateString(history.dateFile, false) : "-"
                                                    }
                                                </TableCell>
                                                <TableCell align="center">
                                                    {history.employee}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        ignoreLine.includes(history.type) ?
                                                            "-"
                                                        :
                                                            history.linesModified
                                                    }
                                                </TableCell>
                                            </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
                            {
                                loading && 
                                    <div className="flex justify-center my-2">
                                        <img
                                            src={loadingSvg}
                                            alt="loading..."
                                            width={50}
                                        />
                                    </div>
                            }
                        </TableContainer>
                    </div>
                </Container>
            </div>
        </>
    );
}

HistoryActions.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(HistoryActions);
