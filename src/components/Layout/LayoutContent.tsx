import { Route, Routes, Navigate } from "react-router-dom";
import Index from "../../pages/Index";
import List from "../../pages/List";
// import ListInput from "../../pages/ListInput";
import Invoice from "../../pages/InvoiceList";
import LoginForm from "../../pages/Login";
import NoData from "../noData/NoData";
import { getUser } from "../../utils/Tokens";
export default function LayoutContent() {
  const userData = getUser("user_data");

  return (
    <Routes>
      {userData?.token ? (
        <>
          <Route element={<Index />}>
            <Route element={<Invoice />} path="/" />
            <Route element={<List />} path="/list" />
            {/* <Route element={<ListInput />} path="/list-input" /> */}
          </Route>
          <Route path="*" element={<NoData />} />
        </>
      ) : (
        <Route path="/login" element={<LoginForm />} />
      )}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
