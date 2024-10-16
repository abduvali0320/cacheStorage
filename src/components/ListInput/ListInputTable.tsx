import React, { useState } from "react";
import { Button, Input, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";

type TableRowSelection<T> = TableProps<T>["rowSelection"];

interface DataType {
    key: React.Key;
    name: string;
    age: string;
    address: string;
    dataIndex?: string;
    action?: React.ReactNode;
}

const ListTable: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "name",
            render: (_text: string, record: DataType) => (
                <Input
                    type="text"
                    value={record.name}
                    onChange={(e) => handleInputChange(e, record.key, "name")}
                />
            ),
        },
        {
            title: "Age",
            dataIndex: "age",
            render: (_text: number, record: DataType) => (
                <Input
                    type="number"
                    value={record.age}
                    onChange={(e) => handleInputChange(e, record.key, "age")}
                />
            ),
        },
        {
            title: "Address",
            dataIndex: "address",
            render: (_text: string, record: DataType) => (
                <Input
                    type="text"
                    value={record.address}
                    onChange={(e) =>
                        handleInputChange(e, record.key, "address")
                    }
                />
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_value: any, record: DataType) => (
                <Button type="primary" onClick={() => sendListItem(record.key)}>
                    Send Item
                </Button>
            ),
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataType[]>(
        Array.from({ length: 10 }, (_, i) => ({
            key: i,
            name: "",
            age: "",
            address: "",
        }))
    );

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const sendListSelected = () => {
        const selectedData = dataSource.filter((item) =>
            selectedRowKeys.includes(item.key)
        );
        console.log("Selected data:", selectedData);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: React.Key,
        column: keyof DataType
    ) => {
        const newValue = e.target.value;
        setDataSource((prevData) =>
            prevData.map((item) =>
                item.key === key
                    ? {
                          ...item,
                          [column]:
                              column === "age" ? Number(newValue) : newValue,
                      }
                    : item
            )
        );
    };

    const sendListItem = (key: React.Key) => {
        const item = dataSource.find((item) => item.key === key);
        if (item) {
            console.log("Send item:", item);
        }
    };

    console.log(15e3);

    return (
        <div>
            <div>
                {hasSelected ? (
                    `Selected ${selectedRowKeys.length} items`
                ) : (
                    <span></span>
                )}
                <div className="text-right">
                    <Button
                        type="primary"
                        onClick={sendListSelected}
                        disabled={!hasSelected}
                    >
                        send-selected
                    </Button>
                </div>
            </div>
            <Table
                size={"small"}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                rowKey="key"
            />
        </div>
    );
};

export default ListTable;
