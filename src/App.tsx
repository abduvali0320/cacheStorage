import React, { useState } from "react";
import { Avatar, Layout, Popover, Tooltip } from "antd";
// import { useSelector } from "react-redux";
// import { ReducerType } from "./Store/Interface";
import { Link } from "react-router-dom";
import sud_logo from "./assets/img/sud-logo.png";

import LayoutContent from "./components/Layout/LayoutContent";
import { UserOutlined } from "@ant-design/icons";
import { getUser, removeUser } from "./utils/Tokens";
const { Header } = Layout;

const App: React.FC = () => {
  // const { load } = useSelector((state: ReducerType) => state.TestSlice);
  const [open, setOpen] = useState(false);
  const userData = getUser("user_data");
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const logout = () => {
    removeUser("user_data");
    window.location.href = "/login";
  };

  return (
    <Layout>
      <Header className="navbar">
        <Link
          to={userData?.token ? "/" : "/login"}
          className="flex flex_element "
        >
          <img src={sud_logo} alt="sud-logo" />
        </Link>
        <div>
          {userData?.token ? (
            <Popover
              className="popover"
              content={
                <p className="logout" onClick={logout}>
                  Logout
                </p>
              }
              trigger="click"
              open={open}
              onOpenChange={handleOpenChange}
            >
              <Tooltip placement="left" title="Одилбек Рахмонов" color="blue">
                <Avatar icon={<UserOutlined />} />
              </Tooltip>
            </Popover>
          ) : (
            <Avatar icon={<UserOutlined />} />
          )}
        </div>
      </Header>
      <LayoutContent />
      {/* <Footer className="footer">© {new Date().getFullYear()}.Year</Footer> */}
    </Layout>
  );
};

export default App;
