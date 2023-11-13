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

const names = [
    'ident',
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

const headCells = [
    {
      id: 'iden',
      label: 'iden',
    },
    {
      id: 'hdr',
      label: 'hdr',
    },
    {
      id: 'mvm',
      label: 'mvm',
    },
    {
      id: 'lin',
      label: 'lin',
    },
    {
      id: 'flh',
      label: 'flh',
    },
    {
      id: 'smtVrf',
      label: 'smtVrf',
    },
    {
      id: 'rsp',
      label: 'rsp',
    },
    {
      id: 'sgl',
      label: 'sgl',
    },
    {
      id: 'cgccpf',
      label: 'cgccpf',
    },
    {
      id: 'dst',
      label: 'dst',
    },
    {
      id: 'dstIn',
      label: 'dstIn',
    },
    {
      id: 'versao',
      label: 'versao',
    },
    {
      id: 'fim',
      label: 'fim',
    },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Title(props) {

    document.title="Título";

    const { openSnackBarFun } = useContext(SnackBarContext);
    const [bpaiList, setBpaiList] = useState([]);
    const [titleBpa, setTitleBpa] = useState({});
    const [identifier, setIdentifier] = useState("");
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
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editActive, setEditActive] = useState(true);
    const [month, setMonth] = useState(localStorage.getItem("@Month"));
    const [year, setYear] = useState(localStorage.getItem("@Year"));
    const [errorMessages, setErrorMessages] = useState([]);
    
    useEffect(() => {
        apiGetTitle();
    }, []);

    async function apiGetTitle() {
        try {
          const response = await api.get(`/title/get/${month}/${year}`);
          setTitleBpa(response.data);
        } catch(e) {
          console.log("Erro: ", e);
        }
        setLoading(false);
    }

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setBpai({...bpai, [name]: value});
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

    function hasOnlyWhitEspace(str) {
        if(/^\s*$/.test(str)) {
          return "Em branco"
        }
      
        return str;
    }

    function formatMonth(month) {
        if(month.length == 1) {
          return "0" + month;
        }
    
        return month;
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("BPA-I")} breadcrumbItem={props.t("BPA-I")} />
                    {
                        titleBpa == {} ?
                            <div className="flex justify-center">
                                <Alert severity="warning" className="">Nenhum BPA-I encontrado no período {formatMonth(month)}/{year}!</Alert>
                            </div>
                        :
                            <>
                                <div className="flex flex-wrap items-end justify-end max-sm:flex-col">
                                    <div>
                                        <LoadingButton
                                            color="error"
                                            disabled={!editActive && !(selected.length > 0)}
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
                                <div className="flex justify-end w-full mt-5 -mb-1">
                                    <div
                                        onClick={() => setEditActive(!editActive)}
                                        className="bg-default p-2 rounded-t-lg cursor-pointer relative"
                                    >
                                        <div className="rotate-0 hover:-rotate-90 transform-none">
                                            <CachedIcon color="primary" sx={{ fontSize: 40 }}/>
                                        </div>
                                    </div>
                                </div>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 1200 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    headCells.map((head, index) => (
                                                        <TableCell key={index} align='center' className="p-4">
                                                            <p className="uppercase font-bold text-[#2a3042]">
                                                                {head.label}
                                                            </p>
                                                        </TableCell>
                                                    ))
                                                }
                                            </TableRow>
                                        </TableHead>
                                            {
                                                !(identifier == '') && !loading &&
                                                    <TableBody>
                                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.iden)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.hdr)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.mvm)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.lin)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.flh)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.smtVrf)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.rsp)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.sgl)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.cgccpf)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.dst)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.dstIn)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.versao)}</TableCell>
                                                        <TableCell align="center">{hasOnlyWhitEspace(titleBpa.fim)}</TableCell>
                                                        </TableRow>
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
                            </>
                    }
                </Container>
            </div>
            {/* <Dialog
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
            </Dialog> */}
        </>
    );
};

Title.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Title);
