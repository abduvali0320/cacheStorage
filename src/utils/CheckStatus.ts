export const checkStatus = (param: string) => {
  switch (param.toLocaleLowerCase()) {
    case "paid":
      return { text: "To'liq to'langan", color: "paid" };
    case "used":
      return { text: "Yaratilgan", color: "used" };
    case "created":
      return { text: "To'lanmagan", color: "created" };
  }
};
