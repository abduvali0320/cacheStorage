import { Pagination, Spin, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { Button, Flex, Table } from "antd";
import type { TableColumnsType } from "antd";
import Breadcrumb from "../components/BreadCrumb/BreadCrumb";
import { InteractionOutlined, LoadingOutlined } from "@ant-design/icons";
import Loading from "../components/Loading/Loading";
import { useHelper } from "../components/Helper";
import { FaDownload } from "react-icons/fa";
import { checkStatus } from "../utils/CheckStatus";
const { Notify } = useHelper();

interface DataType {
  key: React.Key;
  number: string;
  invoiceStatus: number;
  paidAmount: string;
  court: string;
  action?: React.ReactNode;
}

export default function Invoice() {
  const [keshData, setKeshData] = useState<Array<DataType>>([]);
  const [total, setTotal] = useState<{
    totalPages: number;
    totalElements: number;
    page: number;
  }>({
    totalPages: 0,
    totalElements: 0,
    page: 1,
  });

  const url = `https://billing.sud.uz/api/invoice/search?inn=309294593&passportNumber=&page=${total.page}&size=30`;
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownLoading] = useState<string | null>(null);
  const [update_loading, setUpdateLoading] = useState<string | null>(null);
  const [time_loading, setTimeLoading] = useState<boolean>(false);
  const columns: TableColumnsType<DataType> = [
    { title: "Number", dataIndex: "number" },
    {
      title: "InvoiceStatus",
      dataIndex: "invoiceStatus",
      render: (_value: string) => (
        <p className={checkStatus(_value)?.color + " invoiceStatus"}>
          {checkStatus(_value)?.text}
        </p>
      ),
    },
    {
      title: "PaidAmount",
      dataIndex: "paidAmount",
      render: (value) => <p>{numberFormat(String(value))} so'm</p>,
    },
    {
      title: "Court",
      dataIndex: "court",
      render: (value: string) => <p>{value.split(" ").slice(3).join(" ")}</p>,
    },
    {
      title: <p className="flex">Action</p>,
      dataIndex: "action",
      render: (_value: any, record: DataType) => (
        <div className="flex">
          <Tooltip placement="left" title={"Yangilash"}>
            <button onClick={() => update_one(record.number)}>
              <InteractionOutlined className="icon_class" />
              {update_loading === String(record.number) ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : null}
              {update_loading === String(record.number)}
            </button>
          </Tooltip>
          <Tooltip placement="right" title={"Yuklash"}>
            <button onClick={() => download_excel(record.number)}>
              <FaDownload className="icon_class" />
              {downloading === String(record.number) ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : null}
              {downloading === String(record.number)}
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const getData = async (pageNumber: number) => {
    if ("caches" in window) {
      try {
        const cache = await caches.open("invoice-cache");
        const response = await cache.match(`/invoice-data${pageNumber}`);
        const cachePagenation = await cache.match("/invoice-pagenation");
        if (response && cachePagenation) {
          const invoice = await response.json();
          setKeshData(invoice);
          const pagenationResponse = await cache.match("invoice-pagenation");
          if (pagenationResponse) {
            const pagenation = await pagenationResponse.json();
            setTotal(pagenation);
          }
        } else {
          setLoading(true);
          const timeOut = setTimeout(async () => {
            setLoading(false);
            setTimeLoading(true);
            Notify({
              message:
                "Kechirasiz serverda muammo bor, tez orada habar beraman",
              position: "top-right",
              color: "error",
              timeout: 2000,
            });
            const timerInterval = setInterval(async () => {
              setTimeLoading(true);
              try {
                const updatedDataList = await axios.get(url, {
                  params: {
                    totalPages: total.totalPages,
                    totalElements: total.totalElements,
                    pageNumber: total.page,
                  },
                });
                if (updatedDataList.status === 200) {
                  Notify({
                    message: "Malumotlar yuklanishi tugadi",
                    position: "top-right",
                    color: "success",
                    timeout: 2000,
                  });
                  clearInterval(timerInterval);
                  setTotal({
                    ...total,
                    totalPages: updatedDataList.data.totalPages,
                    totalElements: updatedDataList.data.totalElements,
                  });
                  clearTimeout(timeOut);
                  setKeshData(updatedDataList.data.content);
                  const arrayBlob = new Blob(
                    [JSON.stringify(updatedDataList.data.content)],
                    { type: "application/json" }
                  );
                  const cache = await caches.open("invoice-cache");
                  await cache.put(
                    `/invoice-data${total.page}`,
                    new Response(arrayBlob)
                  );
                }
              } catch (error) {
                console.error("Ma'lumotlarni yangilash xatosi:", error);
                clearTimeout(timeOut);
              } finally {
                setTimeLoading(false);
              }
            }, 300000);
          }, 60000);
          try {
            const res = await axios.get(
              `https://billing.sud.uz/api/invoice/search?inn=309294593&passportNumber=&page=${pageNumber}&size=30`,
              {
                params: {
                  totalPages: total.totalPages,
                  totalElements: total.totalElements,
                  pageNumber,
                },
              }
            );
            setTotal({
              totalPages: res.data.totalPages,
              totalElements: res.data.totalElements,
              page: res.data.pageNumber,
            });
            Notify({
              message: "Malumotlar yuklanishi tugadi",
              position: "top-right",
              color: "success",
              timeout: 2000,
            });
            setKeshData(res.data.content);
            clearTimeout(timeOut);
            const arrayBlob = new Blob([JSON.stringify(res.data.content)], {
              type: "application/json",
            });
            const pagenationBlob = new Blob(
              [
                JSON.stringify({
                  totalPages: res.data.totalPages,
                  totalElements: res.data.totalElements,
                  page: res.data.pageNumber,
                }),
              ],
              { type: "application/json" }
            );
            await cache.put(
              `/invoice-data${pageNumber}`,
              new Response(arrayBlob)
            );
            await cache.put("invoice-pagenation", new Response(pagenationBlob));
          } catch (error) {
            clearTimeout(timeOut);
          }
        }
      } catch (error) {
        console.error("Cache yoki tarmoq xatosi:", error);
      } finally {
        setLoading(false);
        setTimeLoading(false);
      }
    } else {
      alert("Cache storage mavjud emas");
    }
  };

  const getCacheData_pagenation = async (param: number) => {
    const pagenationBlob = new Blob(
      [
        JSON.stringify({
          totalPages: total.totalPages,
          totalElements: total.totalElements,
          page: param,
        }),
      ],
      { type: "application/json" }
    );
    try {
      const cache = await caches.open("invoice-cache");
      await cache.put("invoice-pagenation", new Response(pagenationBlob));
      await getData(param);
    } catch (error) {
      console.error("Cache saqlash xatosi:", error);
    }
  };
  const getUpdateList = async () => {
    setLoading(true);
    const timeOut = setTimeout(async () => {
      setLoading(false);
      setTimeLoading(true);
      Notify({
        message: "Kechirasiz serverda muammo bor, tez orada habar beraman",
        position: "top-right",
        color: "error",
        timeout: 2000,
      });
      const timerInterval = setInterval(async () => {
        setTimeLoading(true);
        try {
          const updatedDataList = await axios.get(url, {
            params: {
              totalPages: total.totalPages,
              totalElements: total.totalElements,
              pageNumber: total.page,
            },
          });
          if (updatedDataList.status === 200) {
            Notify({
              message: "Malumotlar yuklanishi tugadi",
              position: "top-right",
              color: "success",
              timeout: 2000,
            });
            clearInterval(timerInterval);
            setTotal({
              ...total,
              totalPages: updatedDataList.data.totalPages,
              totalElements: updatedDataList.data.totalElements,
            });
            clearTimeout(timeOut);
            setKeshData(updatedDataList.data.content);
            const arrayBlob = new Blob(
              [JSON.stringify(updatedDataList.data.content)],
              { type: "application/json" }
            );
            const cache = await caches.open("invoice-cache");
            await cache.put(
              `/invoice-data${total.page}`,
              new Response(arrayBlob)
            );
          }
        } catch (error) {
          console.error("Ma'lumotlarni yangilash xatosi:", error);
          clearTimeout(timeOut);
        } finally {
          setTimeLoading(false);
        }
      }, 300000);
    }, 60000);
    try {
      const updatedDataList = await axios.get(url, {
        params: {
          totalPages: total.totalPages,
          totalElements: total.totalElements,
          pageNumber: total.page,
        },
      });
      Notify({
        message: "Malumotlar yuklanishi tugadi",
        position: "top-right",
        color: "success",
        timeout: 2000,
      });
      setTotal({
        ...total,
        totalPages: updatedDataList.data.totalPages,
        totalElements: updatedDataList.data.totalElements,
      });
      clearTimeout(timeOut);
      setKeshData(updatedDataList.data.content);
      const arrayBlob = new Blob(
        [JSON.stringify(updatedDataList.data.content)],
        { type: "application/json" }
      );
      const cache = await caches.open("invoice-cache");
      await cache.put(`/invoice-data${total.page}`, new Response(arrayBlob));
    } catch (error) {
      console.error("Ma'lumotlarni yangilash xatosi:", error);
      clearTimeout(timeOut);
    } finally {
      setLoading(false);
      setTimeLoading(false);
    }
  };

  const getPagenate_render = async () => {
    const cache = await caches.open("invoice-cache");
    const response = await cache.match(`invoice-pagenation`);
    if (response) {
      const pagenationResponse = await response.json();
      getData(pagenationResponse.page);
      setTotal(pagenationResponse);
    } else {
      getData(total.page);
    }
  };

  useEffect(() => {
    getPagenate_render();
  }, []);

  const update_one = async (item: React.Key) => {
    setUpdateLoading(String(item));
    const link = `https://billing.sud.uz/api/invoice/checkStatus?invoice=${item}&lang=ruName`;
    const timeOut = setTimeout(async () => {
      setTimeLoading(true);
      Notify({
        message: "Kechirasiz serverda muammo bor, tez orada habar beraman",
        position: "top-right",
        color: "error",
        timeout: 2000,
      });
      const timerInterval = setInterval(async () => {
        try {
          const updateItem = await axios.get(link);
          if (updateItem.status === 200) {
            Notify({
              message: "Malumot yangilandi",
              position: "top-right",
              color: "success",
              timeout: 2000,
            });
            clearInterval(timerInterval);
            clearTimeout(timeOut);
            if ("caches" in window) {
              try {
                const cache = await caches.open("invoice-cache");
                const response = await cache.match(
                  `/invoice-data${total.page}`
                );
                if (response) {
                  const invoiceList = await response.json();
                  let itemindex = invoiceList.findIndex(
                    (k: any) => k.number === item
                  );
                  if (itemindex > -1) {
                    invoiceList.splice(itemindex, 1, updateItem.data);
                    setKeshData(invoiceList);
                  }
                  const arrayBlob = new Blob([JSON.stringify(invoiceList)], {
                    type: "application/json",
                  });
                  await cache.put(
                    `/invoice-data${total.page}`,
                    new Response(arrayBlob)
                  );
                }
              } catch (error) {
                console.log(error);
              }
            }
          }
        } catch (error) {
          console.error("Ma'lumotni yangilashda xatolik bor:", error);
          clearTimeout(timeOut);
        } finally {
          setUpdateLoading(null);
          setTimeLoading(false);
        }
      }, 300000);
    }, 60000);
    try {
      const updateItem = await axios.get(link);
      Notify({
        message: "Ma'lumot yangilandi",
        position: "top-right",
        color: "success",
        timeout: 2000,
      });
      clearTimeout(timeOut);
      if ("caches" in window) {
        try {
          const cache = await caches.open("invoice-cache");
          const response = await cache.match(`/invoice-data${total.page}`);
          if (response) {
            const invoiceList = await response.json();
            let itemindex = invoiceList.findIndex(
              (k: any) => k.number === item
            );
            if (itemindex > -1) {
              invoiceList.splice(itemindex, 1, updateItem.data);
              setKeshData(invoiceList);
            }
            const arrayBlob = new Blob([JSON.stringify(invoiceList)], {
              type: "application/json",
            });
            await cache.put(
              `/invoice-data${total.page}`,
              new Response(arrayBlob)
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.error("Ma'lumotni yangilashda xatolik bor:", error);
      // clearTimeout(timeOut);
    } finally {
      setUpdateLoading(null);
      setTimeLoading(false);
    }
  };
  const download_excel = async (item: React.Key) => {
    setDownLoading(String(item));
    const link = `https://billing.sud.uz/api/invoice/asDocument?invoice=${item}`;
    try {
      const res = await axios(link, {
        method: "get",
        responseType: "blob",
      });
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url);
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.setAttribute("download", `invoice_${item}.pdf`);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Notify({
        message: "Malumot yuklashda muammo bor",
        position: "top-right",
        color: "error",
        timeout: 2000,
      });
    } finally {
      setDownLoading(null);
    }
  };
  const numberFormat = (val: string) => {
    const realNumber = val.replace(/\D/g, "");
    if (!realNumber) return "";
    const reversed = realNumber.split("").reverse().join("");
    const parts = reversed.match(/.{1,3}/g);
    return parts?.join(" ").split("").reverse().join("");
  };

  return (
    <div className="container p_bilateral  ">
      <div className="container_box relative">
        <Loading load={loading} timeLoad={time_loading} />
        <Flex gap="middle" vertical>
          <Flex align="center" gap="middle" justify="space-between">
            <div className="flex_element p-10">
              <Breadcrumb />
              <Button
                type="primary"
                onClick={getUpdateList}
                disabled={loading || time_loading}
              >
                Update date
              </Button>
            </div>
          </Flex>
          <Table
            size={"small"}
            columns={columns}
            dataSource={keshData}
            pagination={false}
            scroll={{ y: 600 }}
          />
          <div className="flex-end">
            <Pagination
              current={total.page}
              total={total.totalElements}
              onChange={(pagenate_number) =>
                getCacheData_pagenation(pagenate_number)
              }
              disabled={loading || time_loading}
              showSizeChanger={false}
            />
          </div>
        </Flex>
      </div>
    </div>
  );
}
