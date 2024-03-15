import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SnackBarContext from "../../../../contexts/managerService";
import api from "../../../../services/api";
import Checkbox from "@mui/material/Checkbox";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import loadingSvg from "../../../../assets/images/svg/loading.svg";
import PaginationPer from "../../PaginationPer";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Slide from "@mui/material/Slide";
import { formatMonth } from "../../../../Validation&Formatation/formatation";
import DateGlobalBpaContext from "../../../../contexts/DateGlobalBpa";
import AlertCustom from "../../../../GlobalComponents/AlertCustom";

const names = ["cnes", "cmp", "cbo", "pa", "idade", "qt", "org", "fim"];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Bpac(props) {

    document.title = "Editar BPA-C";
    const employee = JSON.parse(localStorage.getItem("@Employee"));

    const { month, year, getFormattedDate } = useContext(DateGlobalBpaContext);
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [bpacList, setBpacList] = useState([]);
    const [bpac, setBpac] = useState({
        cnes: "",
        cmp: "",
        cbo: "",
        flh: "",
        seq: "",
        pa: "",
        idade: "",
        qt: "",
        org: "",
        fim: "",
    });
    const [loadingTable, setLoadingTable] = useState(true);
    const [filterActive, setFilterActive] = useState("");
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        apiGet();
    }, [month, year, page, size]);

    async function apiGet() {
        setLoadingTable(true);
        try {
            const response = await api.get(
                `/bpac/get/${getFormattedDate()}?page=${
                    page > 0 ? page - 1 : page
                }&size=${size}`
            );
            setBpacList(response.data.content);
            setTotalPage(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (e) {
            setBpacList([]);
        }
        setLoadingTable(false);
    }

    async function apiEdit() {
        setLoading(true);
        try {
            await api.post(`/bpac/edit/${bpac.id}/${employee.key}`, bpac);
            await apiGet();
            handleCloseEdit();
            openSnackBarFun(false, "BPA-C editado");
        } catch (e) {
            if(e.response.data[0]) {
                setErrorMessages(e.response.data);
                openSnackBarFun(true, e.response.data[0].message);
            } else {
                const response = e.response.data;
                
                if(response && response === "FORBIDDEN") {
                    openSnackBarFun(true, "Você não tem autorização para continuar com essa ação.");
                } else {
                    openSnackBarFun();
                }
            }
        }

        setLoading(false);
    }

    async function apiDelete() {
        if (selected.length > 0) {
            setLoading(true);
            try {
                await api.post(`/bpac/delete/${getFormattedDate()}/${employee.key}`, { list: selected });
                await apiGet();
                setOpenDelete(false);
                openSnackBarFun(
                    false,
                    selected.length >= 2 ? "Linhas apagadas" : "Linha apagada"
                );
                setSelected([]);
            } catch (e) {
                const response = e.response.data;
                
                switch(response) {
                    case 'ERROR': {
                        window.location.reload();
                        break;
                    } case 'NOT FOUND BPA': {
                        openSnackBarFun(true, "Data BPA não encontrada!");
                        break;
                    } case 'FORBIDDEN': {
                        openSnackBarFun(true, "Você não tem autorização para continuar com essa ação.");
                        break;
                    } default: {
                        openSnackBarFun(true, "Ops, algo deu errado!");
                    }
                }
            }
        }
        setLoading(false);
    }

    function handleOpenEdit(id) {
        const obj = bpacList.find((bpac) => bpac.id == id);
        setBpac(obj);
        setOpenEdit(true);
    }

    function filterAndSetBpacList(fieldToFilter) {
        setFilterActive(fieldToFilter);
        bpacList.sort((a, b) => {
            if (a[fieldToFilter] < b[fieldToFilter]) return -1;
            if (a[fieldToFilter] > b[fieldToFilter]) return 1;
            return 0;
        });
    }

    function filterDefault() {
        bpacList.sort((a, b) => {
            return a.id + b.id;
        });
        setFilterActive("");
    }

    function handleClick(id) {
        setSelected((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    }

    function handleClose() {
        setOpenEdit(false);
    }

    function handleCloseEdit() {
        setOpenEdit(false);
        setErrorMessages([]);
    }

    function handleSelectAllClick() {
        if (selected.length < size) {
            setSelected([]);
            bpacList.forEach((element) => {
                setSelected((prevSelected) => {
                    return [...prevSelected, element.id];
                });
            });
        } else {
            setSelected([]);
        }
    }

    function hasOnlyWhitEspace(str) {
        if (/^\s*$/.test(str)) {
            return "Em branco";
        }

        return str;
    }

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setBpac({ ...bpac, [name]: value });
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {bpacList.length == 0 ? (
                        <div className="flex justify-center">
                            <AlertCustom
                                msg={`Nenhum BPA-C encontrado no período ${formatMonth(
                                    month
                                    )} de ${year}!`}
                                type="info"
                            />
                        </div>
                    ) : (
                        <>
                            <Breadcrumbs
                                title={props.t("BPA-C")}
                                breadcrumbItem={props.t("BPA-C")}
                            />
                            <div className="flex flex-wrap items-end justify-end max-sm:flex-col">
                                <div>
                                    <LoadingButton
                                        color="error"
                                        disabled={!(selected.length > 0)}
                                        variant="contained"
                                        onClick={() => setOpenDelete(true)}
                                    >
                                        Apagar selecionados
                                    </LoadingButton>
                                </div>
                            </div>
                            <TableContainer component={Paper} className="my-5">
                                <Table
                                    sx={{ minWidth: 1200 }}
                                    size="small"
                                    aria-label="a dense table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                padding="normal"
                                                className="p-2 sticky left-0 bg-default"
                                            >
                                                <Checkbox
                                                    checked={
                                                        selected.length == size
                                                    }
                                                    className="text-white"
                                                    onClick={
                                                        handleSelectAllClick
                                                    }
                                                />
                                            </TableCell>
                                            {names.map((name, index) => {
                                                return (
                                                    <TableCell
                                                        key={index}
                                                        align="center"
                                                        padding="normal"
                                                        className="bg-default"
                                                    >
                                                        <div className="flex justify-center">
                                                            <p className="mr-1 uppercase font-bold text-white">
                                                                {name}
                                                            </p>
                                                            {filterActive ==
                                                            name ? (
                                                                <div
                                                                    onClick={() => {
                                                                        filterDefault();
                                                                    }}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <ArrowUpwardIcon
                                                                        className="text-white"
                                                                        sx={{
                                                                            fontSize: 19,
                                                                        }}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    onClick={() => {
                                                                        filterAndSetBpacList(
                                                                            name
                                                                        );
                                                                    }}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <ArrowDownwardIcon
                                                                        className="text-white"
                                                                        sx={{
                                                                            fontSize: 19,
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bpacList.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                onClick={() =>
                                                    handleClick(item.id)
                                                }
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        { border: 0 },
                                                }}
                                                className={`cursor-pointer ${
                                                    selected.includes(item.id)
                                                        ? "bg-green-200"
                                                        : ""
                                                }`}
                                            >
                                                <TableCell
                                                    align="center"
                                                    className="sticky left-0 bg-default w-[4.5rem]"
                                                >
                                                    <IconButton
                                                        onClick={(e) => {
                                                            handleOpenEdit(
                                                                item.id
                                                            );
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <EditIcon className="text-white" />
                                                    </IconButton>
                                                </TableCell>
                                                {names.map((name, index) => {
                                                    return (
                                                        <TableCell
                                                            key={index}
                                                            align="center"
                                                            className="truncate"
                                                        >
                                                            {hasOnlyWhitEspace(
                                                                item[name]
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {loadingTable && (
                                    <div className="flex justify-center my-2">
                                        <img
                                            src={loadingSvg}
                                            alt="loading..."
                                            width={50}
                                        />
                                    </div>
                                )}
                            </TableContainer>
                            <PaginationPer
                                page={page}
                                size={size}
                                setPage={setPage}
                                setSize={setSize}
                                totalElements={totalElements}
                                totalPage={totalPage}
                            />
                        </>
                    )}
                </Container>
            </div>
            <Dialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Tem a certeza?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Se apagar não voltará a ver o(s) conteudo(s)!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenDelete(false)}
                    >
                        Fechar
                    </Button>
                    <LoadingButton
                        variant="contained"
                        color="error"
                        loading={loading}
                        onClick={apiDelete}
                    >
                        Apagar
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog
                fullScreen
                open={openEdit}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar position="fixed" sx={{ background: "#2a3042" }}>
                    <Toolbar>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={handleClose}
                        >
                            fechar
                        </Button>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        ></Typography>
                        <LoadingButton
                            variant="contained"
                            autoFocus
                            loading={loading}
                            color="success"
                            onClick={apiEdit}
                        >
                            salvar
                        </LoadingButton>
                    </Toolbar>
                </AppBar>
                <div className="flex justify-center">
                    <div className="w-[96%] m-16 mb-10">
                        {names.map((fieldName) => {
                            const error = errorMessages.find(
                                (error) => error.field === fieldName
                            );
                            const message = error ? error.message : "";

                            return (
                                <div key={fieldName}>
                                    <TextField
                                        fullWidth
                                        error={error ? true : false}
                                        id={fieldName}
                                        name={fieldName}
                                        label={fieldName}
                                        variant="outlined"
                                        value={bpac[fieldName]}
                                        helperText={message}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 50) {
                                                handleChangeInput(e);
                                            }
                                        }}
                                        className="mt-4"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Dialog>
        </>
    );
}

Bpac.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(Bpac);
