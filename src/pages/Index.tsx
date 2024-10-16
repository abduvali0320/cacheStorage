import { Outlet } from "react-router-dom";
import SiteBar from "../components/SiteBar/SiteBar";
import { Content } from "antd/es/layout/layout";

export default function Index() {
  return (
    <Content>
      <div className="gridContainer">
        <div className="empty"></div>
        <div className="siteBar">
          <SiteBar />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </Content>
  );
}
