import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  // AppstoreOutlined,
  DatabaseOutlined,
  // SettingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number] & {
  path?: string;
  children?: MenuItem[];
};
const items: MenuItem[] = [
  {
    key: "1",
    icon: <DatabaseOutlined />,
    label: "List invoice",
    path: "/",
  },
  {
    key: "2",
    icon: <UnorderedListOutlined />,
    label: "List",
    path: "/list",
  },
  // {
  //     key: "4",
  //     icon: <AppstoreOutlined />,
  //     label: "Navigation Two",
  //     children: [
  //         { key: "21", label: "Option 1", path: "/option1" },
  //         { key: "22", label: "Option 2", path: "/option2" },
  //         {
  //             key: "23",
  //             label: "Submenu",
  //             children: [
  //                 { key: "231", label: "Option 1", path: "/submenu/option1" },
  //                 { key: "232", label: "Option 2", path: "/submenu/option2" },
  //                 { key: "233", label: "Option 3", path: "/submenu/option3" },
  //             ],
  //         },
  //         {
  //             key: "24",
  //             label: "Submenu 2",
  //             children: [
  //                 {
  //                     key: "241",
  //                     label: "Option 1",
  //                     path: "/submenu2/option1",
  //                 },
  //                 {
  //                     key: "242",
  //                     label: "Option 2",
  //                     path: "/submenu2/option2",
  //                 },
  //                 {
  //                     key: "243",
  //                     label: "Option 3",
  //                     path: "/submenu2/option3",
  //                 },
  //             ],
  //         },
  //     ],
  // },
  // {
  //     key: "5",
  //     icon: <SettingOutlined />,
  //     label: "Navigation Three",
  //     children: [
  //         { key: "31", label: "Option 1", path: "/option1" },
  //         { key: "32", label: "Option 2", path: "/option2" },
  //         { key: "33", label: "Option 3", path: "/option3" },
  //         { key: "34", label: "Option 4", path: "/option4" },
  //     ],
  // },
];

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
  path?: string;
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

const SiteBar: React.FC = () => {
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const findKey = (items: MenuItem[], path: string): string | undefined => {
      for (const item of items) {
        if (item.path === path) {
          return item.key as string;
        }
        if (item.children) {
          const result = findKey(item.children, path);
          if (result) {
            return result;
          }
        }
      }
      return undefined;
    };

    const key = findKey(items, currentPath);
    if (key) {
      setSelectedKeys([key]);
    }
  }, [location.pathname]);

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  const onClick: MenuProps["onClick"] = (e) => {
    const findPath = (items: MenuItem[], key: string): string | undefined => {
      for (const item of items) {
        if (item.key === key) {
          return item.path;
        }
        if (item.children) {
          const result = findPath(item.children, key);
          if (result) {
            return result;
          }
        }
      }
      return undefined;
    };

    const path = findPath(items, e.key);
    if (path) {
      navigate(path);
    }
  };

  return (
    <Menu
      mode="inline"
      openKeys={stateOpenKeys}
      selectedKeys={selectedKeys}
      onOpenChange={onOpenChange}
      onClick={onClick}
      className="siteBar_menu"
      items={items}
    />
  );
};

export default SiteBar;
