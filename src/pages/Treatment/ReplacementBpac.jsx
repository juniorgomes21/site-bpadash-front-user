import PropTypes, { bool } from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import { Card, CardBody, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import api from "../../services/api";
import { withTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AlertCust from "../../GlobalComponents/AlertCustom";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SnackBarContext from "../../contexts/managerService";
import { CircularProgress } from "@mui/material";
import DatePickerContext from "../../contexts/DateGlobalBpa";
import Radio from '@mui/material/Radio';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckIcon from '@mui/icons-material/Check';
import { formatField, formatNameMonth } from "../../Validation&Formatation/formatation";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { orange } from "@mui/material/colors";


const fieldsList = [
    "cnes",
    "cbo",
    "pa",
    "idade",
    "qt",
    "org"
]

function ReplacementBpac(props) {
    
    document.title = "Substituir valor BPA-C";
    
    const url = "/treatment/replacement/custom";
    const { month, year } = useContext(DatePickerContext);
    const { openSnackBarFun } = useContext(SnackBarContext);
    const { getFormattedDate } = useContext(DatePickerContext);
    const [rules, setRules] = useState({});
    const [indexState, setIndexState] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [newRules, setNewRules] = useState([]);
    const [loadingAction, setLoadingAction] = useState(false);
    const [fieldsBpa, setFieldsBpa] = useState([
        {
            name: "cnes",
            hexa: false,
            length: 7
        },
        {
            name:"cbo",
            hexa: true,
            length: 6
        },
        {
            name:"pa",
            hexa: false,
            length: 10
        },
        {
            name:"idade",
            hexa: false,
            length: 3
        },
        {
            name:"qt",
            hexa: false,
            length: 6
        },
        {
            name:"org",
            hexa: true,
            length: 3
        },
        {
            name:"cmp",
            hexa: false,
            length: 6
        },
        {
            name:"cnsmed",
            hexa: false,
            length: 15
        },
        {
            name:"dtaten",
            hexa: false,
            length: 8
        },
        {
            name:"cnspac",
            hexa: true,
            length: 15
        },
        {
            name:"sexo",
            hexa: true,
            length: 1
        },
        {
            name:"ibge",
            hexa: false,
            length: 6
        },
        {
            name:"cid",
            hexa: true,
            length: 4
        },
        {
            name:"caten",
            hexa: false,
            length: 2
        },
        {
            name:"naut",
            hexa: false,
            length: 13
        },
        {
            name:"nmpac",
            hexa: false,
            length: 30
        },
        {
            name:"dtnasc",
            hexa: false,
            length: 8
        },
        {
            name:"raca",
            hexa: false,
            length: 2
        },
        {
            name:"etnia",
            hexa: false,
            length: 4
        },
        {
            name:"nac",
            hexa: false,
            length: 3
        },
        {
            name:"srv",
            hexa: false,
            length: 3
        },
        {
            name:"clf",
            hexa: false,
            length: 3
        },
        {
            name:"equipeSeq",
            hexa: false,
            length: 8
        },
        {
            name:"equipeArea",
            hexa: false,
            length: 4
        },
        {
            name:"cnpj",
            hexa: false,
            length: 14
        },
        {
            name:"ine",
            hexa: false,
            length: 10
        },
        {
            name:"fim",
            hexa: false,
            length: 2
        }
    ]);
    const [ruleObj, setRuleObj] = useState({ "id": 0, "index": -1 });
    const [errors, setErrors] = useState({ "valuefield": false, "valueCriterionOne": false, "valueCriterionTwo": false, "valueCriterionThree": false });
    const [errorsNewRule, setErrorsNewRule] = useState({ "valuefield": false, "valueCriterionOne": false, "valueCriterionTwo": false, "valueCriterionThree": false });
    const [open, setOpen] = useState({ "delete": false, "edit": false, "play": false, "create": false, "playAll": false });


    useEffect(() => {
        apiGetRules();
    }, [])


    async function apiGetRules() {
        try {
            const response = await api.get( url + "/get");
            setRules(response.data);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    async function apiHandleChange(rule, type) {
        try {
            let obj = {}
            if (type === "bpac") {
                obj = {
                    "executeBpac": !rule.executeBpac,
                    "executeBpai": !rule.executeBpai
                }
            } else {
                obj = {
                    "executeBpac": !rule.executeBpac,
                    "executeBpai": !rule.executeBpai
                }
            }
            await api.post( url + `/update/execute/file/${rule.id}`, obj);
            await apiGetRules();
            openSnackBarFun(false, "A regra será executada no arquivo " + (obj.executeBpac ? "BPA-C" : "BPA-I"));

        } catch (e) {
            console.log(e);
        }
    }

    async function apiCreateRule(index) {
        try {
            await api.post( url + "/create", newRules[index]);
            await apiGetRules();
            handleDeleteRule("remove", 0, true, index);
            handleClose();
            openSnackBarFun(false, "Regra salva");
        } catch (e) {
            switch (e.response.data) {
                case "PARANS IQUALS":
                    openSnackBarFun(true, "Você não pode ter critérios com campos iguais");
                    break;
                case "REACHED MAX LENGTH":
                    openSnackBarFun(true,  "Você alcançou o número máximo de regras");
                    break;
                case "EXIST RULE":
                    openSnackBarFun(true, "Você já tem essa regra salva");
                    break;
                default:
                    openSnackBarFun(true, "Ops, algo deu errado");
            }
        }
    }

    async function apiEditRule(index) {
        try {
            const obj = rules.ruleTreatmentReplaceCustoList[index];
            await api.post( url + `/edit/${obj.id}`, obj);
            openSnackBarFun(false, "Regra salva");
        } catch (e) {
            switch (e.response.data) {
                case "PARANS EQUALS":
                    openSnackBarFun(true, "Você não pode ter critérios com campos iguais");
                    break;
                case "VALUES EQUALS":
                    openSnackBarFun(true, "Você não pode ter valores iguais para o mesmo campo");
                    break;
                case "REACHED MAX LENGTH":
                    openSnackBarFun(true,  "Você alcançou o número máximo de regras");
                    break;
                case "EXIST RULE":
                    openSnackBarFun(true, "Você já tem essa regra salva");
                    break;
                default:
                    openSnackBarFun(true, "Ops, algo deu errado");
            }
        }
    }

    async function apiDeleteRule() {
        setLoadingAction(true);
        try {
            await api.post( url + `/delete/${ruleObj.id}`);
            await apiGetRules();
            handleClose();
            openSnackBarFun(false, "Regra apagada");
        } catch (e) {
            console.log(e);
            openSnackBarFun();
        }
        setLoadingAction(false);
    }

    async function apiPlayRule() {
        setLoadingAction(true);
        handleClose();
        try {
            const response = await api.post(url + `/execute/${ruleObj.id}`, { "dateBpa": getFormattedDate() });
            handleClose();
            openSnackBarFun(false, `Regra executada, ${response.data} linhas alteradas`);
        } catch (e) {
            console.log(e);
            openSnackBarFun();
        }
        setLoadingAction(false);
    }

    async function apiPlayAll() {
        setLoading(true);
        handleClose();
        try {
            const response = await api.post( url + "/execute/0", { "dateBpa": getFormattedDate() });
            openSnackBarFun(false, `Todas regras executadas, ${response.data} linhas alteradas`);
        } catch (e) {
            console.log(e);
            openSnackBarFun();
        }
        setLoading(false);
    }

    function actionDialog(actionDi) {
        if (actionDi === "delete") {
            apiDeleteRule();
        } else {
            apiPlayRule();
        }
    }

    function isValid(index, newRule) {
        setIndexState(index);
        let obj = {};
        if(newRule) {
            obj = newRules[index];
        } else {
            obj = rules.ruleTreatmentReplaceCustoList[index];
        }

        const fieldBpac = fieldsBpa.find(field => field.name === obj.field);
        const fieldBpacOne = fieldsBpa.find(field => field.name === obj.criterionOne);
        const fieldBpacTwo = fieldsBpa.find(field => field.name === obj.criterionTwo) || "";
        const fieldBpacThree = fieldsBpa.find(field => field.name === obj.criterionThree) || "";

        const errorField = obj.newValueField.length != fieldBpac.length;
        const errorCriterionOne = obj.valueCriterionOne.length != fieldBpacOne.length;
        const errorCriterionTwo = obj.valueCriterionTwo.length != fieldBpacTwo.length;
        const errorCriterionThree = obj.valueCriterionThree.length != fieldBpacThree.length;

        if (errorField || errorCriterionOne || errorCriterionTwo || errorCriterionThree) {
            if(newRule) {
                setErrorsNewRule({ "valuefield": errorField, "valueCriterionOne": errorCriterionOne, "valueCriterionTwo": errorCriterionTwo, "valueCriterionThree": errorCriterionThree });
            } else {
                setErrors({ "valuefield": errorField, "valueCriterionOne": errorCriterionOne, "valueCriterionTwo": errorCriterionTwo, "valueCriterionThree": errorCriterionThree });
            }
        } else {
            if(newRule) {
                setErrorsNewRule({ "valuefield": false, "valueCriterionOne": false, "valueCriterionTwo": false, "valueCriterionThree": false });
            } else {
                setErrors({ "valuefield": false, "valueCriterionOne": false, "valueCriterionTwo": false, "valueCriterionThree": false });
            }

            if (obj.id) {
                apiEditRule(index);
            } else {
                apiCreateRule(index);
            }
        }
    }

    function handleExecuteRule(action, id, index) {
        setRuleObj({ "id": id, "index": index });
        setOpen({ ...open, [action]: true });
    }

    function handleDeleteRule(action, id, newRule, index) {
        if(newRule) {
            setNewRules( prevRules => {
                const updatedRules = [...prevRules];
                updatedRules.splice(index, 1);

                return updatedRules;
            })
        } else {
            setRuleObj({ "id": id, "index": index });
            setOpen({ ...open, [action]: true });
        }
    }

    function handleAddRule() {
        const obj = {
            "field": "pa",
            "newValueField": "",
            "criterionOne": "pa",
            "valueCriterionOne": "",
            "criterionTwo": "",
            "valueCriterionTwo": "",
            "criterionThree": "",
            "valueCriterionThree": "",
            "executeBpac": false,
            "executeBpai": true,
            "type": "bpac"
        }

        const currentNewRules = [...newRules];

        currentNewRules.push(obj);
        
        setNewRules(currentNewRules.reverse());

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleClose() {
        setErrors({ ...errors, ["error"]: false });
        setOpen({ "delete": false, "edit": false, "play": false, "create": false, "playAll": false });
    }

    function handleHowFileExecute(rule, type, newRule, index) {
        if(newRule) {
            setNewRules((prevRules) => {
                const updatedRules = [...prevRules];
                const updatedRule = updatedRules[index];

                if (type === "bpac") {
                    updatedRule.executeBpac = !rule.executeBpac;
                    updatedRule.executeBpai = !rule.executeBpai;
                } else {
                    updatedRule.executeBpac = !rule.executeBpac;
                    updatedRule.executeBpai = !rule.executeBpai;
                }

                updatedRules[index] = updatedRule;

                return updatedRules;
            });
        } else {
            apiHandleChange(rule, type);
        }
    }

    function handleAddCriterion(index, newRule) {
        if(newRule) {
            setNewRules((prevRules) => {
                const updatedRules = [...prevRules];
                const updatedRule = updatedRules[index];

                if(updatedRule.criterionTwo === "") {
                    updatedRule.criterionTwo = "pa";
                } else {
                    updatedRule.criterionThree = "pa";
                }
    
                updatedRules[index] = updatedRule;

                return updatedRules;
            });

        } else {
            setRules((prevRules) => {
                const updatedRules = [...prevRules.ruleTreatmentReplaceCustoList];
                const updatedRule = updatedRules[index];
    
                if(updatedRule.criterionTwo === "") {
                    updatedRule.criterionTwo = "pa";
                } else {
                    updatedRule.criterionThree = "pa";
                }
    
                updatedRules[index] = updatedRule;

                return { ...prevRules, ruleTreatmentReplaceCustoList: updatedRules };
            });
        }
    }

    function handleRemoveCriterion(index, newRule) {
        if(newRule) {
            setNewRules((prevRules) => {
                const updatedRules = [...prevRules];
                const updateRule = updatedRules[index];
    
                if(updateRule.criterionThree != "") {
                    updateRule.criterionThree = "";
                    updateRule.valueCriterionThree = "";
                } else {
                    updateRule.criterionTwo = "";
                    updateRule.valueCriterionTwo = "";
                }
    
                updatedRules[index] = updateRule;

                return updatedRules;
            });
        } else {
            setRules((prevRules) => {
                const updatedRules = [...prevRules.ruleTreatmentReplaceCustoList];
                const updateRule = updatedRules[index];
    
                if(updateRule.criterionThree != "") {
                    updateRule.criterionThree = "";
                    updateRule.valueCriterionThree = "";
                } else {
                    updateRule.criterionTwo = "";
                    updateRule.valueCriterionTwo = "";
                }
    
                updatedRules[index] = updateRule;

                return { ...prevRules, ruleTreatmentReplaceCustoList: updatedRules };
            });
        }
    }

    function handleOpenAll(dialog) {
        setOpen({ ...open, [dialog]: true });
    }

    function handleChangeValue(event, criterion, newObj, index) {
        const { value } = event.target;

        if(newObj) {
            setNewRules((prevRules) => {
                const updatedRules = [...prevRules];
                const updatedRule = {...updatedRules[index]};
    
                switch(criterion) {
                    case "one": {
                        updatedRule.criterionOne = value;
                        updatedRule.valueCriterionOne = "";
                        break;
                    }
                    case "two": {
                        updatedRule.criterionTwo = value;
                        updatedRule.valueCriterionTwo = "";
                        break;
                    }
                    case "three": {
                        updatedRule.criterionThree = value;
                        updatedRule.valueCriterionThree = "";
                        break;
                    }
                    default: {
                        updatedRule.field = value;
                        updatedRule.newValueField = "";
                    }
                }
    
                updatedRules[index] = updatedRule;
                return updatedRules;
            });
            
        } else {
            setRules((prevRules) => {
                const updatedRules = [...prevRules.ruleTreatmentReplaceCustoList];
                const updatedRule = {...updatedRules[index]};
    
                switch(criterion) {
                    case "one": {
                        updatedRule.criterionOne = value;
                        updatedRule.valueCriterionOne = "";
                        break;
                    }
                    case "two": {
                        updatedRule.criterionTwo = value;
                        updatedRule.valueCriterionTwo = "";
                        break;
                    }
                    case "three": {
                        updatedRule.criterionThree = value;
                        updatedRule.valueCriterionThree = "";
                        break;
                    }
                    default: {
                        updatedRule.field = value;
                        updatedRule.newValueField = "";
                    }
                }
    
                updatedRules[index] = updatedRule;
                return { ...prevRules, ruleTreatmentReplaceCustoList: updatedRules };
            });
        }
    }

    function onChangeCriterion(value, criterion, newObj, index) {
        if(newObj) {
            setNewRules((prevRules) => {
                const updatedRules = [...prevRules];
                const updatedRule = { ...updatedRules[index]};
    
                switch(criterion) {
                    case "one": {
                        updatedRule.valueCriterionOne = value;
                        break;
                    }
                    case "two": {
                        updatedRule.valueCriterionTwo = value;
                        break;
                    }
                    case "three": {
                        updatedRule.valueCriterionThree = value;
                        break;
                    }
                    default: {
                        updatedRule.newValueField = value;
                    }
                }
    
                updatedRules[index] = updatedRule;
                return updatedRules;
            });

        } else {
            setRules((prevRules) => {
                const updatedRules = [...prevRules.ruleTreatmentReplaceCustoList];
                const updatedRule = { ...updatedRules[index]};
    
                switch(criterion) {
                    case "one": {
                        updatedRule.valueCriterionOne = value;
                        break;
                    }
                    case "two": {
                        updatedRule.valueCriterionTwo = value;
                        break;
                    }
                    case "three": {
                        updatedRule.valueCriterionThree = value;
                        break;
                    }
                    default: {
                        updatedRule.newValueField = value;
                    }
                }
    
                updatedRules[index] = updatedRule;
                return { ...prevRules, ruleTreatmentReplaceCustoList: updatedRules };
            });
        }
    }

    function haveFieldBpai(rule) {
        const { field, criterionOne, criterionTwo, criterionThree } = rule;

        const fieldB = fieldsList.includes(field);
        const criterionOneB = fieldsList.includes(criterionOne);
        const criterionTwoB = criterionTwo === "" || fieldsList.includes(criterionTwo);
        const criterionThreeB = criterionThree === "" || fieldsList.includes(criterionThree);
    
        return !(fieldB && criterionOneB && criterionTwoB && criterionThreeB);
    }

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumbs
                        title={props.t("Substituição de PA")}
                        breadcrumbItem={props.t("Substituição de PA")}
                    />
                    <AlertCust
                        type="warning"
                        msg={`As regras serão aplicadas no arquivo BPA do mês de ${formatNameMonth(month)} de ${year}`}
                    />
                    <p className="flex justify-center mt-8 text-center text-sm">
                        Adicione regras de substituição de campo. Aqui, você escolhe um campo no arquivo BPA que será substituído e pode adicionar até 3 critérios para que essa regra seja aplicada. Ao executar a regra, todos os campos escolhidos por você que atenderem aos critérios informados serão substituídos pelo novo valor especificado para o campo.
                    </p>
                    {
                        loading ?
                            <div className="flex justify-center mt-10">
                                <CircularProgress size={25} />
                            </div>
                            :
                                <>
                                    {
                                        rules.ruleTreatmentReplaceCustoList.length == 0 &&
                                            <div className="mt-10">
                                                <AlertCust
                                                    type="info"
                                                    msg="Você ainda não possui nenhuma regra salva"
                                                />
                                            </div>
                                    }
                                    {
                                        newRules.map((rule, index) => (
                                            <div key={index} className="my-4">
                                                <div className="flex justify-end w-full mb-1">
                                                    <div className="flex items-center">
                                                        <Radio
                                                            checked={rule.executeBpac}
                                                            onClick={(e) => handleHowFileExecute(rule, "bpac", true, index)}
                                                            name="radio-buttons"
                                                        />
                                                        <p className="mr-2">BPAC</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Radio
                                                            checked={rule.executeBpai} //fileConfigs[indexState].auto == true
                                                            onClick={(e) => handleHowFileExecute(rule, "bpai", true, index)}
                                                            name="radio-buttons"
                                                        />
                                                        <p className="mr-2">BPAI</p>
                                                        <Tooltip title="Selecione o arquivo que a regra será executada">
                                                            <HelpOutlineIcon sx={{ fontSize: 20 }} />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-between items-center font-bold border-default border-[1px] rounded-lg p-2">
                                                    <div className="flex justify-end w-full">
                                                        {
                                                            loadingAction && index == ruleObj.index ?
                                                                <div className="mr-4 mt-2">
                                                                    <CircularProgress size={20} />
                                                                </div>
                                                                :
                                                                <>
                                                                    <Tooltip title="Remover">
                                                                        <LoadingButton
                                                                            color="error"
                                                                            variant="contained"
                                                                            size="small"
                                                                            onClick={() => handleDeleteRule("delete", 0, true, index)}
                                                                        >
                                                                            <CloseIcon />
                                                                        </LoadingButton>
                                                                    </Tooltip>
                                                                    <div className="mx-2">
                                                                        <Tooltip title="Adicionar Critério">
                                                                            <span>
                                                                                <Button
                                                                                    variant="contained"
                                                                                    size="small"
                                                                                    disabled={rule.criterionThree != ""}
                                                                                    color="warning"
                                                                                    onClick={() => handleAddCriterion(index, true)}
                                                                                >
                                                                                    <AddIcon />
                                                                                </Button>
                                                                            </span>
                                                                        </Tooltip>
                                                                    </div>
                                                                    <Tooltip title="Salvar regra">
                                                                        <LoadingButton
                                                                            disabled={rule.executeBpac == false && rule.executeBpai == false}
                                                                            color="success"
                                                                            variant="contained"
                                                                            size="small"
                                                                            onClick={() => isValid(index, true)}
                                                                        >
                                                                            <CheckIcon />
                                                                        </LoadingButton>
                                                                    </Tooltip>
                                                                </>
                                                        }
                                                    </div>
                                                    <div className="w-full">
                                                        <Row>
                                                            <Col lg="12">
                                                                <Card>
                                                                    <CardBody>
                                                                        <CardTitle className="mb-2">NOVO VALOR DO CAMPO</CardTitle>
                                                                        <Form>
                                                                            <FormGroup className="mb-4" row>
                                                                                <Label
                                                                                    htmlFor="projectname"
                                                                                    className="col-form-label col-lg-2"
                                                                                >
                                                                                    CAMPO
                                                                                </Label>
                                                                                <Col lg="10">
                                                                                    <FormControl sx={{ minWidth: 120 }} size="small">
                                                                                        <InputLabel id="demo-select-small-label"></InputLabel>
                                                                                        <Select
                                                                                            id={`select-${index}`}
                                                                                            labelId={`select-label-${index}`}
                                                                                            value={rule.field}
                                                                                            label=""
                                                                                            onChange={ e => handleChangeValue(e, "zero", true, index)}
                                                                                        >
                                                                                            {
                                                                                                fieldsBpa.map((field, indexMenu) => (
                                                                                                    <MenuItem key={indexMenu} value={field.name}>
                                                                                                        {field.name}
                                                                                                    </MenuItem>
                                                                                                ))
                                                                                            }
                                                                                        </Select>
                                                                                    </FormControl>
                                                                                </Col>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-4" row>
                                                                                <Label
                                                                                    htmlFor="projectname"
                                                                                    className="col-form-label col-lg-2"
                                                                                >
                                                                                    NOVO VALOR DO CAMPO
                                                                                </Label>
                                                                                <Col lg="10">
                                                                                    <TextField
                                                                                        type="text"
                                                                                        value={rule.newValueField}
                                                                                        className="form-control"
                                                                                        size="small"
                                                                                        error={errorsNewRule.valuefield && indexState == index}
                                                                                        helperText={errorsNewRule.valuefield && indexState == index && indexState == index && "Caracteres insuficientes"}
                                                                                        placeholder="Novo valor"
                                                                                        onChange={ e => {
                                                                                            const { length, hexa } = fieldsBpa.find((field) => field.name === rule.field);
                                                                                            if(hexa) {
                                                                                                if(e.target.value.length <= length) onChangeCriterion((e.target.value).toUpperCase(), "zero", true, index);
                                                                                            } else {
                                                                                                if(!isNaN(Number(e.target.value)) && e.target.value.length <= length) onChangeCriterion(e.target.value, "zero", true, index);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </Form>
                                                                    </CardBody>
                                                                    <CardBody>
                                                                        <CardTitle className="mb-2">CRITÉRIO 1</CardTitle>
                                                                        <Form>
                                                                            <FormGroup className="mb-4" row>
                                                                                <Label
                                                                                    htmlFor="projectname"
                                                                                    className="col-form-label col-lg-2"
                                                                                >
                                                                                    CAMPO
                                                                                </Label>
                                                                                <Col lg="10">
                                                                                    <FormControl sx={{ minWidth: 120 }} size="small">
                                                                                        <InputLabel id="demo-select-small-label"></InputLabel>
                                                                                        <Select
                                                                                            id={`select-${index}`}
                                                                                            labelId={`select-label-${index}`}
                                                                                            value={rule.criterionOne}
                                                                                            label=""
                                                                                            onChange={ e => handleChangeValue(e, "one", true, index)}
                                                                                        >
                                                                                            {
                                                                                                fieldsBpa.map((field, indexMenu) => (
                                                                                                    <MenuItem key={indexMenu} value={field.name}>
                                                                                                        {field.name}
                                                                                                    </MenuItem>
                                                                                                ))
                                                                                            }
                                                                                        </Select>
                                                                                    </FormControl>
                                                                                </Col>
                                                                            </FormGroup>
                                                                            <FormGroup className="mb-4" row>
                                                                                <Label
                                                                                    htmlFor="projectname"
                                                                                    className="col-form-label col-lg-2"
                                                                                >
                                                                                    VALOR
                                                                                </Label>
                                                                                <Col lg="10">
                                                                                    <TextField
                                                                                        id="projectname"
                                                                                        name="projectname"
                                                                                        type="text"
                                                                                        size="small"
                                                                                        error={errorsNewRule.valueCriterionOne && indexState == index}
                                                                                        helperText={errorsNewRule.valueCriterionOne && indexState == index && "Caracteres insuficientes"}
                                                                                        value={rule.valueCriterionOne}
                                                                                        className="form-control"
                                                                                        placeholder="Valor do campo"
                                                                                        onChange={ e => {
                                                                                            const { length, hexa } = fieldsBpa.find((field) => field.name === rule.criterionOne);
                                                                                            if(hexa) {
                                                                                                if(e.target.value.length <= length) onChangeCriterion((e.target.value).toUpperCase(), "one", true, index);
                                                                                            } else {
                                                                                                if(!isNaN(Number(e.target.value)) && e.target.value.length <= length) onChangeCriterion(e.target.value, "one", true, index);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </Form>
                                                                    </CardBody>
                                                                    {
                                                                        rule.criterionTwo !== "" && 
                                                                            <CardBody>
                                                                                <CardTitle className="mb-2">CRITÉRIO 2</CardTitle>
                                                                                {
                                                                                    rule.criterionThree == "" && 
                                                                                        <div className="flex justify-end w-full">
                                                                                            <Tooltip title="Remover critério">
                                                                                                <Button
                                                                                                    size="small"
                                                                                                    color="error"
                                                                                                    variant="contained"
                                                                                                    onClick={() => handleRemoveCriterion(index, true)}
                                                                                                >
                                                                                                    REMOVER
                                                                                                </Button>
                                                                                            </Tooltip>
                                                                                        </div>
                                                                                }
                                                                                <Form>
                                                                                    <FormGroup className="mb-4" row>
                                                                                        <Label
                                                                                            htmlFor="projectname"
                                                                                            className="col-form-label col-lg-2"
                                                                                        >
                                                                                            CAMPO
                                                                                        </Label>
                                                                                        <Col lg="10">
                                                                                            <FormControl sx={{ minWidth: 120 }} size="small">
                                                                                                <InputLabel id="demo-select-small-label"></InputLabel>
                                                                                                <Select
                                                                                                    id={`select-${index}`}
                                                                                                    labelId={`select-label-${index}`}
                                                                                                    value={rule.criterionTwo}
                                                                                                    label=""
                                                                                                    onChange={e => handleChangeValue(e, "two", true, index)}
                                                                                                >
                                                                                                    {
                                                                                                        fieldsBpa.map((field, indexMenu) => (
                                                                                                            <MenuItem key={indexMenu} value={field.name}>
                                                                                                                {field.name}
                                                                                                            </MenuItem>
                                                                                                        ))
                                                                                                    }
                                                                                                </Select>
                                                                                            </FormControl>
                                                                                        </Col>
                                                                                    </FormGroup>
                                                                                    <FormGroup className="mb-4" row>
                                                                                        <Label
                                                                                            htmlFor="projectname"
                                                                                            className="col-form-label col-lg-2"
                                                                                        >
                                                                                            VALOR
                                                                                        </Label>
                                                                                        <Col lg="10">
                                                                                            <TextField
                                                                                                id="projectname"
                                                                                                name="projectname"
                                                                                                type="text"
                                                                                                size="small"
                                                                                                error={errorsNewRule.valueCriterionTwo && indexState == index}
                                                                                                helperText={errorsNewRule.valueCriterionTwo && indexState == index && "Caracteres insuficientes"}
                                                                                                value={rule.valueCriterionTwo}
                                                                                                className="form-control"
                                                                                                placeholder="Valor do campo"
                                                                                                onChange={ e => {
                                                                                                    const { length, hexa } = fieldsBpa.find((field) => field.name === rule.criterionTwo);
                                                                                                    if(hexa) {
                                                                                                        if(e.target.value.length <= length) onChangeCriterion((e.target.value).toUpperCase(), "two", true, index);
                                                                                                    } else {
                                                                                                        if(!isNaN(Number(e.target.value)) && e.target.value.length <= length) onChangeCriterion(e.target.value, "two", true, index);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Col>
                                                                                    </FormGroup>
                                                                                </Form>
                                                                            </CardBody>
                                                                    }
                                                                    {
                                                                        rule.criterionThree !== "" && 
                                                                            <CardBody>
                                                                                <CardTitle className="mb-2">CRITÉRIO 3</CardTitle>
                                                                                <div className="flex justify-end w-full">
                                                                                    <Tooltip title="Remover critério">
                                                                                        <Button
                                                                                            size="small"
                                                                                            color="error"
                                                                                            variant="contained"
                                                                                            onClick={() => handleRemoveCriterion(index, true)}
                                                                                        >
                                                                                            REMOVER
                                                                                        </Button>
                                                                                    </Tooltip>
                                                                                </div>
                                                                                <Form>
                                                                                    <FormGroup className="mb-4" row>
                                                                                        <Label
                                                                                            htmlFor="projectname"
                                                                                            className="col-form-label col-lg-2"
                                                                                        >
                                                                                            CAMPO
                                                                                        </Label>
                                                                                        <Col lg="10">
                                                                                            <FormControl sx={{ minWidth: 120 }} size="small">
                                                                                                <InputLabel id="demo-select-small-label"></InputLabel>
                                                                                                <Select
                                                                                                    id={`select-${index}`}
                                                                                                    labelId={`select-label-${index}`}
                                                                                                    value={rule.criterionThree}
                                                                                                    label=""
                                                                                                    onChange={e => handleChangeValue(e, "three", true, index)}
                                                                                                >
                                                                                                    {
                                                                                                        fieldsBpa.map((field, indexMenu) => (
                                                                                                            <MenuItem key={indexMenu} value={field.name}>
                                                                                                                {field.name}
                                                                                                            </MenuItem>
                                                                                                        ))
                                                                                                    }
                                                                                                </Select>
                                                                                            </FormControl>
                                                                                        </Col>
                                                                                    </FormGroup>
                                                                                    <FormGroup className="mb-4" row>
                                                                                        <Label
                                                                                            htmlFor="projectname"
                                                                                            className="col-form-label col-lg-2"
                                                                                        >
                                                                                            VALOR
                                                                                        </Label>
                                                                                        <Col lg="10">
                                                                                            <TextField
                                                                                                id="projectname"
                                                                                                name="projectname"
                                                                                                type="text"
                                                                                                size="small"
                                                                                                error={errorsNewRule.valueCriterionThree && indexState == index}
                                                                                                helperText={errorsNewRule.valueCriterionThree && indexState == index && "Caracteres insuficientes"}
                                                                                                value={rule.valueCriterionThree}
                                                                                                className="form-control"
                                                                                                placeholder="Valor do campo"
                                                                                                onChange={ e => {
                                                                                                    const { length, hexa } = fieldsBpa.find((field) => field.name === rule.criterionThree);
                                                                                                    if(hexa) {
                                                                                                        if(e.target.value.length <= length) onChangeCriterion((e.target.value).toUpperCase(), "three", true, index);
                                                                                                    } else {
                                                                                                        if(!isNaN(Number(e.target.value)) && e.target.value.length <= length) onChangeCriterion(e.target.value, "three", true, index);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Col>
                                                                                    </FormGroup>
                                                                                </Form>
                                                                            </CardBody>
                                                                    }
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        rules.ruleTreatmentReplaceCustoList.length > 0 &&
                                            <div className="flex flex-col items-center w-full mt-10">
                                                <p className="font-bold">
                                                    - MINHAS REGRAS -
                                                </p>
                                                <div className="w-full my-4">
                                                    {
                                                        rules.ruleTreatmentReplaceCustoList.map((rule, index) => (
                                                            <div key={index} className="my-4">
                                                                <div className="flex justify-end w-full mb-1">
                                                                    <div className="flex items-center">
                                                                        <Radio
                                                                            checked={rule.executeBpac}
                                                                            onClick={(e) => apiHandleChange(rule, "bpac")}
                                                                            name="radio-buttons"
                                                                        />
                                                                        <p className="mr-2">BPAC</p>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Radio
                                                                            checked={rule.executeBpai}
                                                                            onClick={(e) => apiHandleChange(rule, "bpai")}
                                                                            name="radio-buttons"
                                                                        />
                                                                        <p className="mr-2">BPAI</p>
                                                                        <Tooltip title="Selecione o arquivo que a regra será executada">
                                                                            <HelpOutlineIcon sx={{ fontSize: 20 }} />
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col justify-between items-center font-bold border-default border-[1px] rounded-lg p-2">
                                                                    <div className="flex justify-end w-full">
                                                                        {
                                                                            loadingAction && index == ruleObj.index ?
                                                                                <div className="mr-4 mt-2">
                                                                                    <CircularProgress size={20} />
                                                                                </div>
                                                                                :
                                                                                <div className="flex justify-between w-full">
                                                                                    <div>
                                                                                        {
                                                                                            (rule.executeBpac && haveFieldBpai(rule)) && 
                                                                                                <Tooltip placement="top" title="Essa regra não será executada no arquivo BPAC, por favor remover os campos BPAI">
                                                                                                    <div className="ml-2 transition transform hover:scale-125">
                                                                                                        <div className="flex justify-center items-center rounded-full p-2">
                                                                                                            <WarningAmberIcon className="text-red-500" sx={{ fontSize: 35 }}/>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </Tooltip>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="flex items-center">
                                                                                        <Tooltip placement="top" title="Excluir" className="hover:-mt-3">
                                                                                            <LoadingButton
                                                                                                color="error"
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                onClick={() => handleDeleteRule("delete", rule.id, false, index)}
                                                                                            >
                                                                                                <DeleteForeverIcon />
                                                                                            </LoadingButton>
                                                                                        </Tooltip>
                                                                                        <div className="mx-2 hover:-mt-3">
                                                                                            <Tooltip placement="top" title="Salvar alterações">
                                                                                                <LoadingButton
                                                                                                    variant="contained"
                                                                                                    size="small"
                                                                                                    onClick={() => isValid(index, false)}
                                                                                                >
                                                                                                    <CheckIcon />
                                                                                                </LoadingButton>
                                                                                            </Tooltip>
                                                                                        </div>
                                                                                        <div className="mr-2 hover:-mt-3">
                                                                                            <Tooltip placement="top" title="Adicionar Critério">
                                                                                                <span>
                                                                                                    <Button
                                                                                                        variant="contained"
                                                                                                        size="small"
                                                                                                        disabled={rule.criterionThree != ""}
                                                                                                        color="warning"
                                                                                                        onClick={() => handleAddCriterion(index, false)}
                                                                                                    >
                                                                                                        <AddIcon />
                                                                                                    </Button>
                                                                                                </span>
                                                                                            </Tooltip>
                                                                                        </div>
                                                                                        <Tooltip placement="top" title="Executar" className="hover:-mt-3">
                                                                                            <LoadingButton
                                                                                                disabled={rule.executeBpac == false && rule.executeBpai == false}
                                                                                                color="success"
                                                                                                variant="contained"
                                                                                                size="small"
                                                                                                onClick={() => handleExecuteRule("play", rule.id, index)}
                                                                                            >
                                                                                                <PlayArrowIcon />
                                                                                            </LoadingButton>
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                </div>
                                                                        }
                                                                    </div>
                                                                    <div className="w-full">
                                                                        <Row>
                                                                            <Col lg="12">
                                                                                <Card>
                                                                                    <CardBody>
                                                                                        <CardTitle className="mb-2">NOVO VALOR DO CAMPO</CardTitle>
                                                                                        <Form>
                                                                                            <FormGroup className="mb-4" row>
                                                                                                <Label
                                                                                                    htmlFor="projectname"
                                                                                                    className="col-form-label col-lg-2"
                                                                                                >
                                                                                                    CAMPO
                                                                                                </Label>
                                                                                                <Col lg="10">
                                                                                                    <FormControl sx={{ minWidth: 120 }} size="small">
                                                                                                        <InputLabel id="demo-select-small-label"></InputLabel>
                                                                                                        <Select
                                                                                                            id={`select-${index}`}
                                                                                                            labelId={`select-label-${index}`}
                                                                                                            value={rule.field}
                                                                                                            label=""
                                                                                                            onChange={ e => handleChangeValue(e, "zero", false, index)}
                                                                                                        >
                                                                                                            {
                                                                                                                fieldsBpa.map((field, indexMenu) => (
                                                                                                                    <MenuItem key={indexMenu} value={field.name}>
                                                                                                                        {field.name}
                                                                                                                    </MenuItem>
                                                                                                                ))
                                                                                                            }
                                                                                                        </Select>
                                                                                                    </FormControl>
                                                                                                </Col>
                                                                                            </FormGroup>
                                                                                            <FormGroup className="mb-4" row>
                                                                                                <Label
                                                                                                    htmlFor="projectname"
                                                                                                    className="col-form-label col-lg-2"
                                                                                                >
                                                                                                    NOVO VALOR DO CAMPO
                                                                                                </Label>
                                                                                                <Col lg="10">
                                                                                                    <TextField
                                                                                                        type="text"
                                                                                                        value={rule.newValueField}
                                                                                                        className="form-control"
                                                                                                        size="small"
                                                                                                        error={errors.valuefield && indexState == index}
                                                                                                        helperText={errors.valuefield && indexState == index && indexState == index && "Caracteres insuficientes"}
                                                                                                        placeholder="Novo valor"
                                                                                                        onChange={ e => {
                                                                                                            const { length, hexa } = fieldsBpa.find((field) => field.name === rule.field);
                                                                                                            if(hexa) {
                                                                                                                if(e.target.value.length <= length) onChangeCriterion((e.target.value).toUpperCase(), "zero", false, index);
                                                                                                            } else {
                                                                                                                if(!isNaN(Number(e.target.value)) && e.target.value.length <= length) onChangeCriterion(e.target.value, "zero", false, index, );
                                                                                                            }
                                                                                                        }}
                                                                                                    />
                                                                                                </Col>
                                                                                            </FormGroup>
                                                                                        </Form>
                                                                                    </CardBody>
                                                                                    <CardBody>
                                                                                        <CardTitle className="mb-2">CRITÉRIO 1</CardTitle>
                                                                                        <Form>
                                                                                            <FormGroup className="mb-4" row>
                                                                                                <Label
                                                                                                    htmlFor="projectname"
                                                                                                    className="col-form-label col-lg-2"
                                                                                                >
                                                                                                    CAMPO
                                                                                                </Label>
                                                                                                <Col lg="10">
                                                                                                    <FormControl sx={{ minWidth: 120 }} size="small">
                                                                                                        <InputLabel id="demo-select-small-label"></InputLabel>
                                                                                                        <Select
                                                                                                            id={`select-${index}`}
                                                                                                            labelId={`select-label-${index}`}
                                                                                                            value={rule.criterionOne}
                                                                                                            label=""
                                                                                                            onChange={ e => handleChangeValue(e, "one", false, index)}
                                                                                                        >
                                                                                                            {
                                                                                                                fieldsBpa.map((field, indexMenu) => (
                                                                                                                    <MenuItem key={indexMenu} value={field.name}>
                                                                                                                        {field.name}
                                                                                                                    </MenuItem>
                                                                                                                ))
                                                                                                            }
                                                                                                        </Select>
                                                                                                    </FormControl>
                                                                                                </Col>
                                                                                            </FormGroup>
                                                                                            <FormGroup className="mb-4" row>
                                                                                                <Label
                                                                                                    htmlFor="projectname"
                                                                                                    className="col-form-label col-lg-2"
                                                                                                >
                                                                                                    VALOR
                                                                                                </Label>
                                                                                                <Col lg="10">
                                                                                                    <TextField
                                                                                                        id="projectname"
                                                                                                        name="projectname"
                                                                                                        type="text"
                                                                                                        size="small"
                                                                                                        error={errors.valueCriterionOne && indexState == index}
                                                                                                        helperText={errors.valueCriterionOne && indexState == index && "Caracteres insuficientes"}
                                                                                                        value={rule.valueCriterionOne}
                                                                                                        className="form-control"
                                                                                                        placeholder="Valor do campo"
                                                                                                        onChange={ e => {
                                                                                                            const { length, hexa } = fieldsBpa.find((field) => field.name === rule.criterionOne);
                                                                                                            if(hexa) {
                                                                                                                if(e.target.value.length <= length) onChangeCriterion((e.target.value).toUpperCase(), "one", false, index);
                                                                                                            } else {
                                                                                                                if(!isNaN(Number(e.target.value)) && e.target.value.length <= length) onChangeCriterion(e.target.value, "one", false, index);
                                                                                                            }
                                                                                                        }}
                                                                                                    />
                                                                                                </Col>
                                                                                            </FormGroup>
                                                                                        </Form>
                                                                                    </CardBody>
                                                                                    {
                                                                                        rule.criterionTwo !== "" && 
                                                                                            <CardBody>
                                                                                                <CardTitle className="mb-2">CRITÉRIO 2</CardTitle>
                                                                                                {
                                                                                                    rule.criterionThree == "" && 
                                                                                                        <div className="flex justify-end w-full">
                                                                                                            <Tooltip title="Remover critério">
                                                                                                                <Button
                                                                                                                    size="small"
                                                                                                                    color="error"
                                                                                                                    variant="contained"
                                                                                                                    onClick={() => handleRemoveCriterion(index, false)}
                                                                                                                >
                                                                                                                    REMOVER
                                                                                                                </Button>
                                                                                                            </Tooltip>
                                                                                                        </div>
                                                                                                }
                                                                                                <Form>
                                                                                                    <FormGroup className="mb-4" row>
                                                                                                        <Label
                                                                                                            htmlFor="projectname"
                                                                                                            className="col-form-label col-lg-2"
                                                                                                        >
                                                                                                            CAMPO
                                                                                                        </Label>
                                                                                                        <Col lg="10">
                                                                                                            <FormControl sx={{ minWidth: 120 }} size="small">
                                                                                                                <InputLabel id="demo-select-small-label"></InputLabel>
                                                                                                                <Select
                                                                                                                    id={`select-${index}`}
                                                                                                                    labelId={`select-label-${index}`}
                                                                                                                    value={rule.criterionTwo}
                                                                                                                    label=""
                                                                                                                    onChange={e => handleChangeValue(e, "two", false, index)}
                                                                                                                >
                                                                                                                    {
                                                                                                                        fieldsBpa.map((field, indexMenu) => (
                                                                                                                            <MenuItem key={indexMenu} value={field.name}>
                                                                                                                                {field.name}
                                                                                                                            </MenuItem>
                                                                                                                        ))
                                                                                                                    }
                                                                                                                </Select>
                                                                                                            </FormControl>
                                                                                                        </Col>
                                                                                                    </FormGroup>
                                                                                                    <FormGroup className="mb-4" row>
                                                                                                        <Label
                                                                                                            htmlFor="projectname"
                                                                                                            className="col-form-label col-lg-2"
                                                                                                        >
                                                                                                            VALOR
                                                                                                        </Label>
                                                                                                        <Col lg="10">
                                                                                                            <TextField
                                                                                                                id="projectname"
                                                                                                                name="projectname"
                                                                                                                type="text"
                                                                                                                size="small"
                                                                                                                error={errors.valueCriterionTwo && indexState == index}
                                                                                                                helperText={errors.valueCriterionTwo && indexState == index && "Caracteres insuficientes"}
                                                                                                                value={rule.valueCriterionTwo}
                                                                                                                className="form-control"
                                                                                                                placeholder="Valor do campo"
                                                                                                                onChange={ e => {
                                                                                                                    const { length, hexa } = fieldsBpa.find((field) => field.name === rule.criterionTwo);
                                                                                                                    if(hexa) {
                                                                                                                        if(e.target.value.length <= length) onChangeCriterion((e.target.value).toUpperCase(), "two", false, index);
                                                                                                                    } else {
                                                                                                                        if(!isNaN(Number(e.target.value)) && e.target.value.length <= length) onChangeCriterion(e.target.value, "two", false, index);
                                                                                                                    }
                                                                                                                }}
                                                                                                            />
                                                                                                        </Col>
                                                                                                    </FormGroup>
                                                                                                </Form>
                                                                                            </CardBody>
                                                                                    }
                                                                                    {
                                                                                        rule.criterionThree !== "" && 
                                                                                            <CardBody>
                                                                                                <CardTitle className="mb-2">CRITÉRIO 3</CardTitle>
                                                                                                <div className="flex justify-end w-full">
                                                                                                    <Tooltip title="Remover critério">
                                                                                                        <Button
                                                                                                            size="small"
                                                                                                            color="error"
                                                                                                            variant="contained"
                                                                                                            onClick={() => handleRemoveCriterion(index, false)}
                                                                                                        >
                                                                                                            REMOVER
                                                                                                        </Button>
                                                                                                    </Tooltip>
                                                                                                </div>
                                                                                                <Form>
                                                                                                    <FormGroup className="mb-4" row>
                                                                                                        <Label
                                                                                                            htmlFor="projectname"
                                                                                                            className="col-form-label col-lg-2"
                                                                                                        >
                                                                                                            CAMPO
                                                                                                        </Label>
                                                                                                        <Col lg="10">
                                                                                                            <FormControl sx={{ minWidth: 120 }} size="small">
                                                                                                                <InputLabel id="demo-select-small-label"></InputLabel>
                                                                                                                <Select
                                                                                                                    id={`select-${index}`}
                                                                                                                    labelId={`select-label-${index}`}
                                                                                                                    value={rule.criterionThree}
                                                                                                                    label=""
                                                                                                                    onChange={e => handleChangeValue(e, "three", false, index)}
                                                                                                                >
                                                                                                                    {
                                                                                                                        fieldsBpa.map((field, indexMenu) => (
                                                                                                                            <MenuItem key={indexMenu} value={field.name}>
                                                                                                                                {field.name}
                                                                                                                            </MenuItem>
                                                                                                                        ))
                                                                                                                    }
                                                                                                                </Select>
                                                                                                            </FormControl>
                                                                                                        </Col>
                                                                                                    </FormGroup>
                                                                                                    <FormGroup className="mb-4" row>
                                                                                                        <Label
                                                                                                            htmlFor="projectname"
                                                                                                            className="col-form-label col-lg-2"
                                                                                                        >
                                                                                                            VALOR
                                                                                                        </Label>
                                                                                                        <Col lg="10">
                                                                                                            <TextField
                                                                                                                id="projectname"
                                                                                                                name="projectname"
                                                                                                                type="text"
                                                                                                                size="small"
                                                                                                                error={errors.valueCriterionThree && indexState == index}
                                                                                                                helperText={errors.valueCriterionThree && indexState == index && "Caracteres insuficientes"}
                                                                                                                value={rule.valueCriterionThree}
                                                                                                                className="form-control"
                                                                                                                placeholder="Valor do campo"
                                                                                                                onChange={ e => {
                                                                                                                    const { length, hexa } = fieldsBpa.find((field) => field.name === rule.criterionThree);
                                                                                                                    if(hexa) {
                                                                                                                        if(e.target.value.length <= length) onChangeCriterion((e.target.value).toUpperCase(), "three", false, index);
                                                                                                                    } else {
                                                                                                                        if(!isNaN(Number(e.target.value)) && e.target.value.length <= length) onChangeCriterion(e.target.value, "three", false, index);
                                                                                                                    }
                                                                                                                }}
                                                                                                            />
                                                                                                        </Col>
                                                                                                    </FormGroup>
                                                                                                </Form>
                                                                                            </CardBody>
                                                                                    }
                                                                                </Card>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                    }
                                </>
                    }
                    <div className="fixed bottom-16 right-4">
                        <Button
                            variant="contained"
                            sx={{
                                mr: 2
                            }}
                            onClick={() => handleAddRule()}
                        >
                            NOVA REGRA
                        </Button>
                        <Button
                            color="success"
                            variant="contained"
                            onClick={() => handleOpenAll("playAll")}
                        >
                            EXECUTAR TODAS AS REGRAS
                        </Button>
                    </div>
                    <Dialog open={open["delete"] || open["play"]} onClose={() => handleClose()}>
                        <DialogTitle>
                            {
                                open.delete ?
                                    "Deseja realmente apagar essa regras?"
                                :
                                    `Essa regra será executa no arquivo ${(ruleObj.index && ruleObj.index >= 0 && rules.ruleTreatmentReplaceCustoList[ruleObj.index].executeBpac) ? "BPA-C" : "BPA-I"}`
                            }
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText className="mb-3">
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color={open.delete ? "primary" : "error"}
                                onClick={() => handleClose()}
                            >
                                FECHAR
                            </Button>
                            <Button
                                variant="contained"
                                color={open.delete ? "error" : "success"}
                                onClick={() => actionDialog(open.delete ? "delete" : "playRule")}
                            >
                                {open.delete ? "APAGAR" : "EXECUTAR"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={open["playAll"]} onClose={() => handleClose()}>
                        <DialogTitle>
                            Deseja realmente executar todas as regras?
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText className="mb-3">
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleClose()}
                            >
                                FECHAR
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => apiPlayAll()}
                            >
                                EXECUTAR TODAS
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </div>
        </>
    );
};

ReplacementBpac.propTypes = {
    t: PropTypes.any,
    chartsData: PropTypes.any,
    onGetChartsData: PropTypes.func,
};

export default withTranslation()(ReplacementBpac);
