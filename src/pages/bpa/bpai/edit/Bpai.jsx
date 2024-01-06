import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import api from "../../../../services/api";
import PaginationPer from "../../PaginationPer";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import LoadingButton from "@mui/lab/LoadingButton";
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import SelectColl from "../../SelectColl";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SnackBarContext from "../../../../contexts/managerService";
import loadingSvg from "../../../../assets/images/svg/loading.svg";
import Alert from '@mui/material/Alert';
import { formatMonth } from "../../../../Validation&Formatation/formatation";
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Bpai(props) {

    document.title="Editar BPA-I";

    const { month, year } = useContext(DateGlobalBpaContext);
    const { openSnackBarFun } = useContext(SnackBarContext);
    const [bpaiList, setBpaiList] = useState([]);
    const [filterActive, setFilterActive] = useState("");
    const [bpai, setBpai] = useState({
		ident: '',
		cnes: '',
		cmp: '',
		cnsmed: '',
		cbo: '',
		dtaten: '',
		flh: '',
		seq: '',
		pa: '',
		cnspac: '',
		sexo: '',
		ibge: '',
		cid: '',
		idade: '',
		q: '',
		caten: '',
		naut: '',
		org: '',
		nmpac: '',
		dtnasc: '',
		raca: '',
		etnia: '',
		nac: '',
		srv: '',
		clf: '',
		equipeSeq: '',
		equipeArea: '',
		cnpj: '',
		cepPcnte: '',
		logradPcnte: '',
		endPcnte: '',
		complPcnte: '',
		numPcnte: '',
		bairroPcnte: '',
		ddtelPcnte: '',
		emailPcnte: '',
		ine: '',
		fim: ''
    });
    const [bpaiNamesList, setBpaiNamesList] = useState(names.copyWithin());
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(true);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [errorMessages, setErrorMessages] = useState([]);
    
    useEffect(() => {
        apiGetBPAI();
    }, [month, year, page, size])

    async function apiGetBPAI() {
        setLoadingTable(true);
        try {
            const response = await api.get(`/bpai/get/${month}/${year}?page=${page > 0 ? page - 1 : page}&size=${size}`);
            setBpaiList(response.data.content);
            setTotalPage(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch(e) {
            setSelected([]);
            console.log("Erro: ", e.response);
        }
        setLoadingTable(false);
    }

    async function apiEditBPAI() {
        setLoading(true);
        try {
          await api.post(`/bpai/edit/${bpai.id}`, bpai);
          await apiGetBPAI();
          handleCloseEdit();
          openSnackBarFun(false, "BPA-I editado");
        } catch(e) {
          setErrorMessages(e.response.data);
          openSnackBarFun(true, e.response.data[0].message);
        }
        setLoading(false);
    }

    async function apiDeleteBPAI() {
        if(selected.length > 0) {
          setLoading(true);
          try {
            await api.post("/bpai/delete", { list: selected });
            await apiGetBPAI();
            setOpenDelete(false);
            openSnackBarFun(false, selected.length >= 2 ? "Linhas apagadas" : "Linha apagada");
            setSelected([]);
          } catch(e) {
            openSnackBarFun(true, "Ops, algo deu errado!");
          }
        }
        setLoading(false);
    }

    function handleOpenEdit(id) {
        const obj = bpaiList.find( bpai => bpai.id == id);
        setBpai(obj);
        setOpenEdit(true);
    }
    
    function handleCloseEdit() {
        setOpenEdit(false);
        setErrorMessages([]);
    }

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setBpai({...bpai, [name]: value});
    }
    
    function handleClose() {
        setOpenEdit(false);
    }

    function handleClickSelect(item) {
        setBpaiNamesList(prevList => {
            if (prevList.includes(item)) {
                return prevList.filter( name => name !== item);
            } else {
                return [...prevList, item];
            }
        });
    }

    function filterAndSetBpaiList(fieldToFilter) {
        setFilterActive(fieldToFilter);
        bpaiList.sort((a, b) => {
          if (a[fieldToFilter] < b[fieldToFilter]) return -1;
          if (a[fieldToFilter] > b[fieldToFilter]) return 1;
          return 0;
        });
    }

    function filterDefault() {
        bpaiList.sort((a, b) => { return a.id + b.id});
        setFilterActive("");
    }

    function handleClick(id) {
        setSelected(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(item => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    }

    function handleSelectAllClick() {
        if (selected.length < size) {
            setSelected([]);
            bpaiList.forEach( element => {
                setSelected(prevSelected => {
                return [...prevSelected, element.id]
                })
            });
        } else {
            setSelected([]);
        }
    }

    function hasOnlyWhitEspace(str) {
        if(/^\s*$/.test(str)) {
          return "Em branco"
        }
      
        return str;
    }


    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("EDITAR BPAI")} breadcrumbItem={props.t("EDITAR BPAI")} />
                    {
                        bpaiList.length == 0 ?
                            <div className="flex justify-center">
                                <Alert severity="warning" className="">Nenhum BPA-I encontrado no período {formatMonth(month)}/{year}!</Alert>
                            </div>
                        :
                            <>
                                <div className="flex flex-wrap items-end justify-end max-sm:flex-col">
                                    <div>
                                        <LoadingButton
                                            color="error"
                                            disabled={ !(selected.length > 0)}
                                            variant="contained"
                                            onClick={() => setOpenDelete(true)}
                                        >
                                            Apagar selecionados
                                        </LoadingButton>
                                    </div>
                                    <div className="mx-3">
                                        <SelectColl
                                            names={bpaiNamesList}
                                            handleClick={handleClickSelect}
                                        />
                                    </div>
                                </div>
                                <TableContainer component={Paper} className="my-5">
                                    <Table sx={{ minWidth: 1200 }} size="small" aria-label="a dense table">
                                        <TableHead className="bg-default">
                                            <TableRow>
                                                <TableCell
                                                    align="center"
                                                    padding="normal"
                                                    className="p-2 sticky left-0 bg-default"
                                                >
                                                <Checkbox
                                                    checked={selected.length == size}
                                                    className="text-white"
                                                    onClick={handleSelectAllClick}
                                                />
                                                </TableCell>
                                                { names.map((name, index) => {
                                                    return bpaiNamesList.includes(name) && 
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
                                                                    {
                                                                        filterActive == name ?    
                                                                            <div
                                                                                onClick={() => {filterDefault()}}
                                                                                className="cursor-pointer"
                                                                            >
                                                                                <ArrowUpwardIcon className="text-white" sx={{ fontSize: 19}}/>
                                                                            </div>
                                                                        :
                                                                            <div
                                                                                onClick={() => {filterAndSetBpaiList(name)}}
                                                                                className="cursor-pointer"
                                                                            >
                                                                                <ArrowDownwardIcon className="text-white" sx={{ fontSize: 19}}/>
                                                                            </div>
                                                                    }
                                                                </div>
                                                            </TableCell>
                                                    }
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            { bpaiList.map((item) => (
                                                <TableRow
                                                    key={item.id}
                                                    onClick={() => handleClick(item.id)}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    className={`cursor-pointer ${selected.includes(item.id) ? "bg-green-200" : ""}`}
                                                >
                                                    <TableCell align="center" className="sticky left-0 bg-default">
                                                        <IconButton onClick={ e => {
                                                                handleOpenEdit(item.id);
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <EditIcon className="text-white"/>
                                                        </IconButton>
                                                    </TableCell>
                                                    {
                                                        names.map((name, index) => {
                                                            return bpaiNamesList.includes(name) &&
                                                                <TableCell key={index} align="center" className="truncate">
                                                                    {hasOnlyWhitEspace(item[name])}
                                                                </TableCell>
                                                        })
                                                    }
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {
                                        loadingTable &&
                                            <div className='flex justify-center my-2'>
                                                <img src={loadingSvg} alt="loading..." width={50}/>
                                            </div>
                                    }
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
                    }
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
                        onClick={
                            () => setOpenDelete(false)
                        }
                    >
                        Fechar
                    </Button>
                    <LoadingButton
                        variant="contained"
                        color="error"
                        loading={loading}
                        onClick={apiDeleteBPAI}
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
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    </Typography>
                    <LoadingButton
                        variant="contained"
                        autoFocus
                        loading={loading}
                        color="success"
                        onClick={apiEditBPAI}
                    >
                        salvar
                    </LoadingButton>
                </Toolbar>
                </AppBar>
                <div className="flex justify-center">
                    <div className="w-[96%] m-16 mb-10">
                        {
                            names.map((fieldName) => {
                                const error = errorMessages.find(error => error.field === fieldName);
                                const message = error ? error.message : '';

                                return (
                                    <div key={fieldName}>
                                        <TextField
                                            fullWidth
                                            error={error ? true : false}
                                            id={fieldName}
                                            name={fieldName}
                                            label={fieldName}
                                            variant="outlined"
                                            value={bpai[fieldName]}
                                            helperText={message}
                                            onChange={ e => {
                                                if (e.target.value.length <= 50) {
                                                    handleChangeInput(e)
                                                }
                                            }}
                                            className="mt-4"
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Dialog>
        </>
    );
};

Bpai.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Bpai);
