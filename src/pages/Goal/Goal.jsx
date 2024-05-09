import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
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
import loadingSvg from "../../assets/images/svg/loading.svg";
import Tooltip from "@mui/material/Tooltip";
import { maskMoney, maskPa } from "../../Validation&Formatation/formatation";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AlertCustom from "../../GlobalComponents/AlertCustom";
import TableHead from '@mui/material/TableHead';
import api from "../../services/api";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";


const names = [
    "PA",
    "Descrição",
    "Quant. Produzida",
    "Quant. Orçada",
    "Valor Unitário",
    "Valor total",
    "Porcentagem",
    "Verificado"
]

function Goal(props) {

    document.title = "Meta";

    const [fpoList, setFpoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pa, setPa] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [exist, setExist] = useState(true);
    const [loadingExist, setLoadingExist] = useState(true);


    useEffect(() => {
        existFpo();
    }, [page, size])

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
            const response = await api.get(`/goal/all/${pa.trim().length === 0 ? "null" : pa.trim()}?page=${ page > 0 ? page - 1 : page }&size=${size}`);
            setFpoList(response.data.content);
            setTotalPage(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            
        } catch(e) {
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
                    <Breadcrumbs title={props.t("Meta Geral")} breadcrumbItem={props.t("Meta Geral")} />
                    {
                        exist ?
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
                                                METAS FPO
                                            </Typography>
                                            <div>
                                                <Tooltip placement="top" title="Use o filtro para buscar PAs que iniciam com um valor determinado (EX: 0202)">
                                                    <InfoOutlinedIcon sx={{ color: "white", mr: 1, fontSize: 20}} />
                                                </Tooltip>
                                            </div>
                                            <div>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    inputProps={{ maxLength: 9 }}
                                                    className="bg-white rounded-md"
                                                    onChange={ e => setPa(e.target.value)}
                                                />
                                            </div>
                                            <IconButton onClick={() => {}}>
                                                <Button
                                                    variant="contained"
                                                    endIcon={
                                                        <SearchIcon sx={{ color: "white"}} />
                                                    }
                                                    onClick={getGoals}
                                                >
                                                    Filtrar
                                                </Button>
                                            </IconButton>
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
                                                                    align={'center'}
                                                                    padding={'normal'}
                                                                    className="p-4"
                                                                >
                                                                    <p className="uppercase font-bold text-[#2a3042]">
                                                                        {name.toUpperCase()}
                                                                    </p>
                                                                </TableCell>
                                                            )
                                                        )}
                                                    </TableRow>
                                                </TableHead>
                                                {!loading && (
                                                        <TableBody>
                                                            {
                                                                fpoList.map((fpo, index) => {
                                                                    const isGoal = fpo.quantProd > fpo.quantOrcada;

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
                                                                                {maskPa(fpo.pa)}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                                className="truncate"
                                                                            >
                                                                                {fpo.name}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                                className="truncate"
                                                                            >
                                                                                {fpo.quantProd}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                                className="truncate"
                                                                            >
                                                                                {fpo.quantOrcada}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                                className="truncate"
                                                                            >
                                                                                {maskMoney(fpo.valueUnit)}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                                className="truncate"
                                                                            >
                                                                                {maskMoney(fpo.valueTotal)}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="left"
                                                                                className={`!font-bold ${fpo.percent < 100 ? "!text-red-500" : "!text-green-500"}`}
                                                                            >
                                                                                <Tooltip placement="top" title="Porcentagem da quantidade produzida">
                                                                                    <>
                                                                                        { isGoal ? <NorthIcon sx={{ fontSize: 15, mr: 2 }} /> : <SouthIcon sx={{ fontSize: 15, mr: 2 }} />}
                                                                                        { fpo.percent } %
                                                                                    </>
                                                                                </Tooltip>
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                                className="truncate"
                                                                            >
                                                                                <Tooltip placement="top" title="Se o valor Total desse PA está correto (Quantidade produzida x Valor unitário)">
                                                                                    {fpo.error ? <CheckCircleOutlineIcon sx={{ color: "green" }} /> : <HighlightOffIcon sx={{ color: "red" }} /> }
                                                                                </Tooltip>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })
                                                            }
                                                        </TableBody>
                                                )}
                                            </Table>
                                        </TableContainer>
                                        {
                                            loading ?
                                                <div className="flex justify-center">
                                                    <img
                                                        src={loadingSvg}
                                                        alt="loading..."
                                                        width={50}
                                                        className="my-10"
                                                    />
                                                </div>
                                            :
                                                fpoList.length > 0 ?
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
                                                            msg={"Nenhum registro FPO encontrado."}
                                                            type={"info"}
                                                        />
                                                    </div>
                                        }
                                    </Paper>
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
        </>
    )
}

Goal.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
}

export default withTranslation()(Goal);
