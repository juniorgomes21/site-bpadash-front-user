import React from "react";
import { Redirect } from "react-router-dom";


// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Bpa from "../pages/bpa/bpa/Bpa";
import StorageMemory from "../pages/Dashboard/StorageMemory";
import Upload from "../pages/upload/file/Upload";
import Download from "../pages/Download/Download";
import Bpai from "../pages/bpa/bpai/edit/Bpai";
import Bpac from "../pages/bpa/bpac/edit/Bpac";
import UploadBpai from "../pages/upload/file/UploadBpai";
import UploadBpac from "../pages/upload/file/UploadBpac";
import Validation from "../pages/Validation/Validation";
import Timeline from "../pages/Timeline/Timeline";
import Title from "../pages/bpa/title/edit/Title";
import Fpo from "../pages/upload/file/Fpo";
import LineFpo from "../pages/upload/line/LineFpo";
import ProfessionalLine from "../pages/upload/line/ProfessionalLine";
import UploadProfessional from "../pages/upload/file/UploadProfessional";
import Inconsistency from "../pages/Inconsistency/Inconsistency";
import FilesConf from "../pages/Configurations/FilesConf";
import ProfessionalEdit from "../pages/consult/ProfessionalsEdit";
import TreatmentPa from "../pages/Treatment/TreatmentPa";
import TreatmentPaCbo from "../pages/Treatment/TreatmentPaCbo";
import DeletePerPa from "../pages/Treatment/DeletePerPa";
import PublicPlace from "../pages/Treatment/PublicPlace";
import Profile from "../pages/Configurations/Profile";
import ChangePass from "../pages/Configurations/ChagenPass";


const authProtectedRoutes = [
  { path: "/file/bpa", component: Bpa },
  { path: "/file/edit/title", component: Title },
  { path: "/file/edit/bpai", component: Bpai },
  { path: "/file/edit/bpac", component: Bpac },
  { path: "/file/consult/professionals", component: ProfessionalEdit },
  { path: "/storage/memory", component: StorageMemory },
  { path: "/upload/fpo", component: Fpo },
  { path: "/upload/fpo/line", component: LineFpo },
  { path: "/upload/bpa", component: Upload },
  { path: "/upload/bpai", component: UploadBpai },
  { path: "/upload/bpac", component: UploadBpac },
  { path: "/upload/professionals", component: UploadProfessional },
  { path: "/upload/professionals/line", component: ProfessionalLine },
  { path: "/download/bpa", component: Download },
  { path: "/validation/file", component: Validation },
  { path: "/timeline/bpa", component: Timeline },
  { path: "/inconsistency", component: Inconsistency },
  { path: "/configurations/files", component: FilesConf },
  { path: "/configurations/register", component: Profile },
  { path: "/configurations/password", component: ChangePass },
  { path: "/treatment/pa", component: TreatmentPa },
  { path: "/treatment/pa/cbo", component: TreatmentPaCbo },
  { path: "/treatment/pa/delete", component: DeletePerPa },
  { path: "/treatment/public/place", component: PublicPlace },
  { path: "/logout", component: Logout },
  
  { path: "/", exact: true, component: () => <Redirect to="/storage/memory" /> },
];

const publicRoutes = [
  
  { path: "/login", component: Login },
];

export { authProtectedRoutes, publicRoutes };
