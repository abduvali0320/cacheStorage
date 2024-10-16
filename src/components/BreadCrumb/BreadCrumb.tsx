import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb as AntdBreadcrumb } from "antd";
import { HomeFilled } from "@ant-design/icons";

interface BreadcrumbItem {
    title: React.ReactNode;
    path: string;
}

const Breadcrumb: React.FC = () => {
    const location = useLocation();
    const { pathname } = location;

    const createBreadcrumbItems = (path: string): BreadcrumbItem[] => {
        const paths = path.split("/").filter((p) => p);
        const breadcrumbItems: BreadcrumbItem[] = [
            {
                title: <HomeFilled className="homeFill" />,
                path: "/",
            },
        ];

        let accumulatedPath = "";
        paths.forEach((part) => {
            accumulatedPath += `/${part}`;
            breadcrumbItems.push({
                title: part,
                path: accumulatedPath,
            });
        });

        return breadcrumbItems;
    };

    const breadcrumbItems = createBreadcrumbItems(pathname);

    const breadcrumbItemsWithLinks = breadcrumbItems.map((item, index) => ({
        title:
            index === breadcrumbItems.length - 1 ? (
                <span className="text_gray"> {item.title} </span>
            ) : (
                <Link to={item.path} className={"text_dodgerblue"}>
                    {item.title}
                </Link>
            ),
    }));

    return (
        <AntdBreadcrumb
            className="linkBreadCrumb"
            items={[...breadcrumbItemsWithLinks]}
        ></AntdBreadcrumb>
    );
};

export default Breadcrumb;
