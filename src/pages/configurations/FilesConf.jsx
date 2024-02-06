import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import DescriptionIcon from '@mui/icons-material/Description';
import { Link } from "react-router-dom";
import Radio from '@mui/material/Radio';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from "@mui/material/Tooltip";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { formatMonth } from "../../Validation&Formatation/formatation";
import api from "../../services/api";
import { Button } from "@mui/material";

const files = [
    {
      name: 'Ocupação',
      acronym: 'CBO',
      show: true
    },
    {
      name: 'FPO',
      acronym: 'FPO',
      show: true
    },
    {
      name: 'Profissionais',
      acronym: 'PROF',
      show: false
    },
    {
      name: 'Logradouro',
      acronym: 'CEP',
      show: true
    },
    {
      name: 'Procedimentos',
      acronym: 'PROC',
      show: true
    }
]

function FilesConf(props) {

  document.title="Configuração dos Arquivos";

  const [fileConfigs, setFileConfigs] = useState([]);
  const [indexState, setIndexState] = useState(0);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [datesMonths, setDatesMonths] = useState([]);
  const [datesYears, setDatesYears] = useState([]);
  const [nameFile, setNameFile] = useState("Ocupação");


  useEffect(() => {
    getFiles();
  }, [])


  async function getFiles() {
    try {
      const response = await api.get("/sigtap/get/all/dates");
      setFileConfigs(response.data);
      const item = response.data[0];

      if(item.dateCurrent.length > 0) {
        setMonth(item.dateCurrent[0][0]);
        setYear(item.dateCurrent[0][1]);
        
        setDatesYears(item.years);

        const newArray = item.datesFull.find(itemx => itemx[1][0] == item.dateCurrent[0][1]);
        setDatesMonths(newArray[0]);
      }

    } catch(e) {
      console.log(e);
      console.log("Erro ao buscar os arquivos");
    }
  }

  function handleChange(event) {

    setDatesYears(fileConfigs[indexState].years);

    const auto = fileConfigs[indexState].auto;

    let obj = [];
    setFileConfigs(prevList => {
      const newList = [...prevList];
      obj = { ...newList[indexState], auto: !auto };
      newList[indexState] = obj;
      if(!auto || obj.dateCurrent.length > 0) {
        onChangeObj(obj);
      }

      return newList;
    });
  }

  function changeFile(index) {
    const item = fileConfigs[index];

    setDatesYears(item.years);

    if(item.dateCurrent.length > 0) {
      setMonth(item.dateCurrent[0][0]);
      setYear(item.dateCurrent[0][1]);
      
      const newArray = item.datesFull.find(itemx => itemx[1][0] == item.dateCurrent[0][1]);
      setDatesMonths(newArray[0]);
    } else {
      setMonth('');
      setYear('');
    }

    setNameFile(item.arqName);
    setIndexState(index);
  }

  function handleChangeMonth(event) {

    const monthHandle = event.target.value;

    setMonth(monthHandle);

    let obj = [];
    setFileConfigs(prevList => {
      const newList = [...prevList];
      obj = { ...newList[indexState], dateCurrent: [[[monthHandle], [year]]] }
      newList[indexState] = obj;
      onChangeObj(obj);

      return newList;
    });

  }

  async function onChangeObj(obj) {
    try {
      await api.post("/sigtap/update/date", obj);
    } catch (e) {
      console.log(e.response);
    }
  }

  function handleChangeYear(event) {
    const year = event.target.value;
    const newArray = fileConfigs[indexState].datesFull.find(item => item[1][0] == year);
    
    setMonth('');
    setDatesMonths(newArray[0]);
    setYear(event.target.value);
  }


  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Inconsistências")}
            breadcrumbItem={props.t("Configuração dos Arquivos")}
          />
          {
            fileConfigs.length > 0 &&
              <>
                <div className="flex justify-center text-base">
                  <p>Configure individualmente os arquivos </p>
                </div>
                <div className="flex flex-wrap justify-around w-full my-12">
                      {
                          files.map((file, index)=>(
                              <div
                                key={index}
                                onClick={() => changeFile(index)}
                                className={`flex flex-col items-center cursor-pointer rounded-lg  ${indexState == index ? `shadow-xl border-[0.5px] -mt-4 ${ fileConfigs[index].datesFull.length == 0 ? "shadow-red-400 border-red-300" : "shadow-green-400 border-green-300"}` : ""} p-3`}
                              >
                                  <div key={index} className={`flex flex-col items-center border-2 bg-white ${ fileConfigs[index].datesFull.length > 0 ? "border-green-500" : "border-red-500"} ${indexState == index ? "-mt-8 mb-2" : "hover:-mt-4 hover:mb-4"} p-3 w-28 rounded-md`}>
                                      <div className="flex flex-col items-center my-1">
                                          <DescriptionIcon sx={{ fontSize: 30, color: fileConfigs[index].datesFull.length != 0 ? "green" : "red" }}/>
                                          <p>{file.acronym}</p>
                                      </div>
                                      <p>{file.name}</p>
                                  </div>
                              </div>
                          ))
                      }
                </div>
                <div className="flex justify-center w-full mt-8">
                  <div className="w-4/5 border-[1px] border-default rounded-md">
                    {
                      datesYears.length == 0 ?
                        <>
                          <div className="flex justify-center w-full my-8">
                            <p className="text-base">
                            Você ainda não possui nenhum arquivo ({nameFile}). Por favor, faça o upload.
                            </p>
                          </div>
                          <div className="flex justify-center w-full my-8">
                            <Link to={nameFile === "FPO" ? "/upload/fpo" : "/upload/professionals"}>
                              <Button
                                variant="contained"
                              >
                                Fazer upload {">"}
                              </Button>
                            </Link>
                          </div>
                        </>
                      :
                      <>
                        <div className="flex justify-center w-full my-8">
                          <p className="text-base">
                            Selecione a forma com que o sistema irá obter a data do arquivo ({nameFile})
                          </p>
                        </div>
                        <div className="flex justify-around w-full my-3">
                            <div className="flex items-center">
                              <Radio
                                checked={fileConfigs[indexState].auto == false}
                                onClick={handleChange}
                                name="radio-buttons"
                              />
                              <p className="mr-2">Manual</p>
                              <Tooltip title="Você seleciona a data do arquivo">
                                <HelpOutlineIcon sx={{ fontSize: 20 }}/>
                              </Tooltip>
                            </div>
                            <div className="flex items-center">
                              <Radio
                                checked={fileConfigs[indexState].auto == true}
                                onClick={handleChange}
                                name="radio-buttons"
                              />
                              <p className="mr-2">Automática</p>
                              <Tooltip title="O sistema pegará o arquivo mais recente">
                                <HelpOutlineIcon sx={{ fontSize: 20 }}/>
                              </Tooltip>
                            </div>
                        </div>
                        {
                          !fileConfigs[indexState].auto &&
                            <div className="flex justify-center my-10">
                              <div className="mr-10">
                                  <div className="mb-2">
                                      <p className="text-base">Selecione o mês desejado</p>
                                  </div>
                                  <FormControl
                                    fullWidth
                                  >
                                    <InputLabel id="demo-simple-select-label">{'Mês'}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        disabled={year === ''}
                                        value={month}
                                        label={'Mês'}
                                        onChange={handleChangeMonth}
                                        >
                                        {datesMonths.map((item, index) => (
                                            <MenuItem key={index} value={item}>
                                                {formatMonth(item)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                  </FormControl>
                              </div>
                              <div>
                                  <div className="mb-2">
                                    <p className="text-base">Selecione o ano desejado</p>
                                  </div>
                                  <FormControl
                                    fullWidth
                                  >
                                    <InputLabel id="demo-simple-select-label">{'Ano'}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={year}
                                        label={'Ano'}
                                        onChange={handleChangeYear}
                                    >
                                    {datesYears.map((item, index) => (
                                        <MenuItem key={index} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                  </FormControl>
                              </div>
                            </div>
                        }
                      </>
                    }
                  </div>
                </div>
              </>
          }
        </Container>
      </div>

    </>
  );
};

FilesConf.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(FilesConf);
