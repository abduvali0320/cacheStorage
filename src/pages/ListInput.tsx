import Breadcrumb from "../components/BreadCrumb/BreadCrumb";
import ListTable from "../components/ListInput/ListInputTable";

export default function ListInput() {
    return (
        <div className="container p_bilateral">
            <div className="container_box">
                <Breadcrumb />
                <ListTable />
            </div>
        </div>
    );
}
