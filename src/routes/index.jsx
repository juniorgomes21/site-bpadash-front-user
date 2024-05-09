import React from "react";
import { Redirect } from "react-router-dom";
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Bpa from "../pages/bpa/bpa/Bpa";
import StorageMemory from "../pages/Graphics/Storage/StorageMemory";
import Upload from "../pages/upload/file/Upload";
import Download from "../pages/Download/Download";
import Bpai from "../pages/bpa/bpai/edit/Bpai";
import Bpac from "../pages/bpa/bpac/edit/Bpac";
import UploadBpai from "../pages/upload/file/UploadBpai";
import UploadBpac from "../pages/upload/file/UploadBpac";
import HistoryActions from "../pages/HistoryActions/HistoryActions";
import TimeLineBpa from "../pages/Timeline/TimeLineBpa";
import Title from "../pages/bpa/title/edit/Title";
import UploadProfessional from "../pages/upload/file/UploadProfessional";
import Inconsistency from "../pages/Inconsistency/Inconsistency";
import FilesConf from "../pages/Configurations/FilesConf";
import ProfessionalEdit from "../pages/Consult/ProfessionalsEdit";
import TreatmentPa from "../pages/Treatment/TreatmentPa";
import TreatmentPaCbo from "../pages/Treatment/TreatmentPaCbo";
import DeletePerPa from "../pages/Treatment/DeletePerPa";
import Profile from "../pages/Configurations/Profile";
import ChangePass from "../pages/Configurations/ChagenPass";
import ReplacementBpac from "../pages/Treatment/ReplacementBpac";
import TimeLineProfessionals from "../pages/Timeline/TimeLineProfessionals";
import UploadFpo from "../pages/upload/file/UploadFpo";
import ConsultFpo from "../pages/Consult/ConsultFpo";
import TimeLineFpo from "../pages/Timeline/TimeLineFpo";
import Client from "../pages/Consult/Client";
import Graphics from "../pages/Graphics/month/Graphics";
import GraphicsGoal from "../pages/Goal/Graphics";
import Welcome from "../pages/Dashboard/welcome/Welcome";
import GraphicsYear from "../pages/Graphics/year/GraphicsYear";
import TermsUse from "../pages/Terms&Use/TermsUse";
import MetricsPa from "../pages/Metrics/MetricsPa";
import MetricsCbo from "../pages/Metrics/MetricsCbo";
import MetricsCnsmed from "../pages/Metrics/MetricsCnsmed";
import ReloadDataBpa from "../pages/Configurations/ReloadDataBpa";
import Home from "../pages/Home/Home";
import Prices from "../pages/Home/Prices";
import RegisterEmployee from "../pages/Users/RegisterEmployee";
import LoginEmployee from "../pages/Authentication/LoginEmployee";
import DataEmployee from "../pages/Users/DataEmployee";
import Goal from "../pages/Goal/Goal";
import PerGroups from "../pages/Goal/PerGroups";
import GraphicsYearly from "../pages/Goal/GraphicsYearly";


const authProtectedRoutes = [
    { path: "/login/employee", component: LoginEmployee },

    { path: "/welcome/user/bpadash", component: Welcome },
    { path: "/file/bpa", component: Bpa },
    { path: "/file/edit/title", component: Title },
    { path: "/file/edit/bpai", component: Bpai },
    { path: "/file/edit/bpac", component: Bpac },
    { path: "/file/consult/fpo", component: ConsultFpo },
    { path: "/file/consult/customers", component: Client },
    { path: "/file/consult/professionals", component: ProfessionalEdit },
    { path: "/storage/memory", component: StorageMemory },
    { path: "/graphics", component: Graphics },
    { path: "/graphics/year", component: GraphicsYear },
    { path: "/upload/bpa", component: Upload },
    { path: "/upload/bpai", component: UploadBpai },
    { path: "/goal", component: Goal },
    { path: "/goal/per/groups", component: PerGroups },
    { path: "/goal/per/groups/graphics", component: GraphicsGoal },
    { path: "/goal/per/groups/graphics/yearly", component: GraphicsYearly },
    { path: "/upload/bpac", component: UploadBpac },
    { path: "/upload/fpo", component: UploadFpo },
    { path: "/upload/professionals", component: UploadProfessional },
    { path: "/metrics/pa", component: MetricsPa },
    { path: "/metrics/cbo", component: MetricsCbo },
    { path: "/metrics/cnsmed", component: MetricsCnsmed },
    { path: "/download/bpa", component: Download },
    { path: "/history/actions", component: HistoryActions },
    { path: "/timeline/bpa", component: TimeLineBpa },
    { path: "/timeline/fpo", component: TimeLineFpo },
    { path: "/timeline/professionals", component: TimeLineProfessionals },
    { path: "/inconsistency", component: Inconsistency },
    { path: "/configurations/reload/file/bpa", component: ReloadDataBpa },
    { path: "/configurations/files", component: FilesConf },
    { path: "/configurations/terms&Use", component: TermsUse },
    { path: "/configurations/register", component: Profile },
    { path: "/configurations/password", component: ChangePass },
    { path: "/treatment/pa", component: TreatmentPa },
    { path: "/treatment/pa/cbo", component: TreatmentPaCbo },
    { path: "/treatment/pa/delete", component: DeletePerPa },
    { path: "/treatment/replacement/bpa", component: ReplacementBpac },
    { path: "/users/registered", component: RegisterEmployee },
    { path: "/employee/register", component: DataEmployee },
    { path: "/logout", component: Logout },

    { path: "/", exact: true, component: () => <Redirect to="/welcome/user/bpadash" /> },
];

const publicRoutes = [
    { path: "/welcome", component: Home },
    { path: "/prices", component: Prices },
    { path: "/login", component: Login },
];

export { authProtectedRoutes, publicRoutes };
