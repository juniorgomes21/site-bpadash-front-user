import PropTypes from "prop-types";
import React, { useState, useEffect, useContext } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import api from "../../services/api";
import loadingSvg from "../../assets/images/svg/loading.svg";
import { maskMoney, maskPointThree } from "../../Validation&Formatation/formatation";
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AlertCustom from "../../GlobalComponents/AlertCustom";
import TableHead from '@mui/material/TableHead';
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import DialogActions from '@mui/material/DialogActions';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SnackBarContext from "../../contexts/managerService";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const names = [
    "PA",
    "Quant. Produzida",
    "Quant. Orçada",
    "Valor total Produzido",
    "Porcentagem",
    "Ação"
]

function PerGroups(props) {

    document.title = "Meta por Grupo";

    const { openSnackBarFun } = useContext(SnackBarContext);

    const [fpoList, setFpoList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingExist, setLoadingExist] = useState(true);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [paInput, setPaInput] = useState("");
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(-1);
    const [exist, setExist] = useState(true);

    useEffect(() => {
        existFpo();
    }, [])

    async function existFpo() {
        try {
            const response = await api.get("/fpo/exist");
            if(response.data) {
                await getGoals();
            } else {
                setExist(false);
            }
            
        } catch (e) {
            console.log(e);
        }
        setLoadingExist(false);
    }

    async function getGoals() {
        setLoading(true);
        try {
            const response = await api.get("/goal/get/groups");
            setFpoList(response.data);

        } catch(e) {
            console.log(e);
        }
        setLoading(false);
    }

    async function createGoals() {
        setLoadingCreate(true);
        setError(false);
        try {
            await api.post("/goal/create/group", { "pa": paInput });
            await getGoals();
            handleCloseDialog();
            openSnackBarFun(false, "Grupo PA criado com sucesso!");

        } catch(e) {
            setError(true);
        }
        setLoadingCreate(false);
    }

    async function deleteGoals(pa, key) {
        setLoadingDelete(key);
        try {
            await api.post("/goal/delete/group", { "pa": pa });
            await getGoals();
            openSnackBarFun(false, "Grupo PA excluído com sucesso!");

        } catch(e) {
            console.log(e);
            openSnackBarFun();
        }
        setLoadingDelete(-1);
    }

    function handleOpenDialog() {
        setOpen(true);
    }

    function handleCloseDialog() {
        setPaInput("");
        setError(false);
        setOpen(false);
    }

    if(loadingExist) {
        return (
            <div className="flex justify-center mt-20">
                <CircularProgress size={20}/>
            </div>
        )
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title={props.t("Meta por Grupo")}
                        breadcrumbItem={props.t("Meta por Grupo")}
                    />
                    {
                        exist ?
                            <>
                                <div className="my-4">
                                    <AlertCustom
                                        type="info"
                                        msg="Você poderá criar grupos personalizados por prefixos de PAs. (Poderá ter até 10 grupos)"
                                    />
                                </div>
                                <div>
                                    <Paper sx={{ width: "100%", mb: 10 }}>
                                        <Toolbar
                                            sx={{
                                                pl: { sm: 2 },
                                                pr: { xs: 1, sm: 1 },
                                            }}
                                            className="flex justify-between bg-[#2a3042] text-white"
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                <Typography
                                                    sx={{ flex: "1 1 100%" }}
                                                    variant="h6"
                                                    id="tableTitle"
                                                    component="div"
                                                >
                                                    METAS FPO
                                                </Typography>
                                                <Tooltip placement="top" title="Agrupe seus procedimentos por um prefixo de PA EX: (0202...) e veja a quantidade Produzida e mais informações">
                                                    <HelpOutlineOutlinedIcon sx={{ ml: 1, color: "yellow" }}/>
                                                </Tooltip>
                                            </div>
                                            <div className="flex items-center font-bold text-base">
                                                <p className="mr-2">
                                                    GRUPOS:
                                                </p>
                                                <p>
                                                    {fpoList.length}
                                                </p>
                                            </div>
                                        </Toolbar>
                                        <TableContainer>
                                            <Table
                                                sx={{ minWidth: 1200 }}
                                                aria-labelledby="tableTitle"
                                                size={"medium"}
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        {names.map((name, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={"center"}
                                                                padding={"normal"}
                                                                className="p-4"
                                                            >
                                                                <p className="uppercase font-bold text-[#2a3042]">
                                                                    {name.toUpperCase()}
                                                                </p>
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                {!loading && (
                                                    <TableBody>
                                                        {fpoList.map((fpo, index) => {
                                                            const isGoal =
                                                                fpo.quantProd >
                                                                fpo.quantOrcada;

                                                            return (
                                                                <TableRow
                                                                    role="checkbox"
                                                                    tabIndex={-1}
                                                                    key={index}
                                                                >
                                                                    <TableCell
                                                                        align="center"
                                                                        className="truncate"
                                                                    >
                                                                        {fpo.pa}...
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        className="truncate"
                                                                    >
                                                                        {maskPointThree(
                                                                            fpo.quantProd
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        className="truncate"
                                                                    >
                                                                        {maskPointThree(
                                                                            fpo.quantOrcada
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        className="truncate"
                                                                    >
                                                                        {maskMoney(
                                                                            fpo.valueTotal
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        className={`!font-bold ${
                                                                            fpo.percent <
                                                                            100
                                                                                ? "!text-red-500"
                                                                                : "!text-green-500"
                                                                        }`}
                                                                    >
                                                                        <Tooltip
                                                                            placement="top"
                                                                            title="Porcentagem da quantidade produzida"
                                                                        >
                                                                            <>
                                                                                {isGoal ? (
                                                                                    <NorthIcon
                                                                                        sx={{
                                                                                            fontSize: 15,
                                                                                            mr: 2,
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <SouthIcon
                                                                                        sx={{
                                                                                            fontSize: 15,
                                                                                            mr: 2,
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                                {
                                                                                    fpo.percent
                                                                                }{" "}
                                                                                %
                                                                            </>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        className="truncate"
                                                                    >
                                                                        {loadingDelete ===
                                                                        index ? (
                                                                            <CircularProgress
                                                                                size={24}
                                                                                color="error"
                                                                            />
                                                                        ) : (
                                                                            <>
                                                                                <Tooltip
                                                                                    placement="top"
                                                                                    title="Apagar grupo"
                                                                                >
                                                                                    <DeleteForeverIcon
                                                                                        color="error"
                                                                                        sx={{
                                                                                            ml: 2,
                                                                                        }}
                                                                                        onClick={() =>
                                                                                            deleteGoals(
                                                                                                fpo.pa,
                                                                                                index
                                                                                            )
                                                                                        }
                                                                                        className="cursor-pointer"
                                                                                    />
                                                                                </Tooltip>
                                                                            </>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                )}
                                            </Table>
                                        </TableContainer>
                                        {loading ? (
                                            <div className="flex justify-center">
                                                <img
                                                    src={loadingSvg}
                                                    alt="loading..."
                                                    width={50}
                                                    className="my-10"
                                                />
                                            </div>
                                        ) : (
                                            fpoList.length === 0 && (
                                                <div className="flex justify-center w-full py-10">
                                                    <AlertCustom
                                                        msg={
                                                            "Nenhum grupo de PA encontrado."
                                                        }
                                                        type={"info"}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </Paper>
                                </div>
                                <div className="fixed bottom-24 right-8">
                                    <Button
                                        variant="contained"
                                        disabled={fpoList.length - 10 === 0}
                                        onClick={handleOpenDialog}
                                    >
                                        Novo Grupo
                                    </Button>
                                </div>
                            </>
                        :
                            <>
                                <div className="my-4">
                                    <AlertCustom
                                        type="info"
                                        msg="NÃO EXISTE NENHUM ARQUIVO FPO"
                                    />
                                </div>
                            </>
                    }
                </Container>
            </div>
            <Dialog open={open} onClose={() => handleCloseDialog()}>
                <DialogTitle>
                    Adicione um novo Grupo PA. (Ex: 02020)
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        id="pa"
                        label="PA"
                        value={paInput}
                        type="text"
                        error={error}
                        inputProps={{ maxLength: 9 }}
                        variant="standard"
                        onChange={ e => {
                            const value = e.target.value;
                            if(!isNaN(value)) setPaInput(value);
                        }}
                        helperText={error && "O valor do PA deve ter entre 2 a 9 dígitos"}
                    />
                    
                </DialogContent>
                <DialogActions className="flex justify-end w-full">
                    {
                        loadingCreate ?
                            <div className="flex justify-end w-full">
                                <CircularProgress size={25} sx={{ mr: 2 }}/>
                            </div>
                        :
                            <>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleCloseDialog()}
                                >
                                    FECHAR
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={createGoals}
                                >
                                    SALVAR
                                </Button>
                            </>
                    }
                </DialogActions>
            </Dialog>
        </>
    );
}

PerGroups.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(PerGroups);
