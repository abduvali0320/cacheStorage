import React, { ReactNode, useState } from "react";
import { Flex, Pagination, Spin, Table, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { FaDownload } from "react-icons/fa";
import { LoadingOutlined } from "@ant-design/icons";
import { checkStatus } from "../../utils/CheckStatus";
import { formatNumber } from "../../utils/formatNumber";

interface DataType {
  key?: React.Key;
  name?: string;
  age?: number;
  state?: string;
  action?: ReactNode;
  number?: string | undefined;
}

const ListTable: React.FC = () => {
  const [downloading, setDownloading] = useState(null);
  const download_excel = (param: DataType) => {
    console.log(param);
  };
  const columns: TableColumnsType<DataType> = [
    { title: "Shartnoma", dataIndex: "name" },
    { title: "Invoice raqam", dataIndex: "invoiceNumber" },
    {
      title: "Summa",
      dataIndex: "summa",
      render: (summa: number) => <span> {formatNumber(summa)} </span>,
    },
    {
      title: "Xolati",
      dataIndex: "state",
      render: function (data: string) {
        return (
          <span className={checkStatus(data)?.color + " invoiceStatus"}>
            {checkStatus(data)?.text}
          </span>
        );
      },
    },
    {
      title: "action",
      dataIndex: "action",
      render: (_, record: DataType) => {
        return (
          <Tooltip placement="right" title={"Yuklash"}>
            <button onClick={() => download_excel(record)}>
              <FaDownload className="icon_class" />
              {downloading === String(record.number) ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : null}
              {downloading === String(record.number)}
            </button>
          </Tooltip>
        );
      },
    },
  ];

  const dataSource = Array.from<DataType>({ length: 41 }).map<DataType>(
    (_, i) => ({
      key: i,
      name: `Edward King ${i}`,
      summa: parseFloat(((i + 1) / 5).toFixed(4)) * 10000,
      invoiceNumber: i * 2,
      state: i % 4 == 0 ? "paid" : "used",
    })
  );
  return (
    <Flex gap="middle" vertical>
      <Table
        size={"small"}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <div>
        <Pagination
        // current={total.page}
        // total={total.totalElements}
        // onChange={(pagenate_number) =>
        //   getCacheData_pagenation(pagenate_number)
        // }
        // disabled={loading || time_loading}
        // showSizeChanger={false}
        />
      </div>
    </Flex>
  );
};

export default ListTable;
