import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import api from "../../services/api";
import { formatDateString } from "../../Validation&Formatation/formatation";
import Tooltip from '@mui/material/Tooltip';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import loadingSvg from "../../assets/images/svg/loading.svg";
import SnackBarContext from "../../contexts/managerService";
import AlertCustom from "../../GlobalComponents/AlertCustom";
import DateGlobalBpaContext from "../../contexts/DateGlobalBpa";
import AuthContext from "../../contexts/Auth";


function TimeLineBpa(props) {

    document.title="Linha do Tempo BPA";

    const screenSize = window.screen.width;
    const employee = JSON.parse(localStorage.getItem("@Employee"));

    const { month, year } = useContext(DateGlobalBpaContext);
    const { openSnackBarFun } = useContext(SnackBarContext);
    const { getDates } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [timeLine, setTimeLine] = useState([]);
    const [select, setSelect] = useState([]);
    const [open, setOpen] = useState(false);

    
    useEffect(() => {
        apiGetTimeLine();
    }, [])


    async function apiGetTimeLine() {
        try {
            const response = await api.get("/bpa/timeline");
            setTimeLine(response.data);
        } catch(e) {
        }
        setLoading(false);
    }

    async function apiDelete() {
        try {
            setLoading(true);
            await api.post(`/bpa/delete/${employee.key}`, select);
            await getDates();
            openSnackBarFun(false, "Arquivos apagados!")
            setSelect([]);
            apiGetTimeLine();
        } catch(e) {
            const response = e.response.data;
            
            if(response && response === "FORBIDDEN") {
                openSnackBarFun(true, "Você não tem autorização para continuar com essa ação.");
            } else {
                openSnackBarFun();
            }
            
            setLoading(false);
        }
    }


    function selectBPA(identifier) {
        if(select.includes(identifier)) {
            const updatedSelect = select.filter(item => item !== identifier);
            setSelect(updatedSelect);
        } else {
            setSelect([...select, identifier]);
        }
    }


    function isDate(item) {
        const date = formatDateString(item.date);
        const dateSelect = formatDateString(`${year}-${(month < 9 ? "0" + month : month)}-01`);

        if(date === dateSelect) {
            return true;
        }

        return false;
    }

    function handleClick() {
        setOpen(true);
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={props.t("Linha do Tempo BPA")} breadcrumbItem={props.t("Linha do Tempo BPA")} />
                    {
                        loading ?
                            <div className="flex justify-center mt-20">
                                <img src={loadingSvg} alt="svg" width={70}/>
                            </div>
                        :
                            <div>
                                {
                                    select.length > 0 &&
                                        <div
                                            className="flex  justify-start ml-2 w-full my-3 cursor-pointer"
                                            onClick={() => handleClick()}
                                        >
                                            <Tooltip title="Apagar" placement="top">
                                                <DeleteIcon color="error"/>
                                            </Tooltip>
                                        </div>
                                }
                                {
                                    timeLine.length == 0 ?
                                        <AlertCustom
                                            type="info"
                                            msg="Você não possui nenhum arquivo BPA!"
                                        />
                                    :
                                        timeLine.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center border-b-[1px] border-zinc-300 hover:border-zinc-400"
                                            >
                                                <div className="flex items-center w-9/12">
                                                    <div
                                                        onClick={ e => {
                                                                selectBPA(item.identifier);
                                                                e.stopPropagation();
                                                            }}
                                                    >
                                                        <Checkbox
                                                            size="small"
                                                        />
                                                    </div>
                                                    {
                                                        isDate(item) &&
                                                        <Tooltip title="BPA selecionado" placement="top">
                                                            <BookmarkIcon color="success" sx={{ fontSize: 20, mr: 1 }}/>
                                                        </Tooltip>
                                                    }
                                                    <div className="w-44">
                                                        <p>{item.name}</p>
                                                    </div>
                                                    {
                                                        screenSize > 990 &&
                                                            <div className="overflow-hidden whitespace-nowrap ml-2">
                                                                {item.description}
                                                            </div>
                                                    }
                                                </div>
                                                <div className="flex w-3/12">
                                                    <div className="flex justify-end font-bold w-3/4">
                                                        <p>{item.fileSize}</p>
                                                    </div>
                                                    <div className="flex justify-end font-bold w-1/4">
                                                        <p>{formatDateString(item.date)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>
                    }
                    
                </Container>
            </div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Tem a certeza?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Se apagar não voltará a ver o conteudo!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => 
                            setOpen(false)
                        }
                    >
                        FECHAR
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            apiDelete();
                            setOpen(false);
                        }}
                    >
                        APAGAR
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

TimeLineBpa.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(TimeLineBpa);
