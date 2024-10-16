const getUser = (key: string) => {
  const item = localStorage.getItem(key); 
  return item ? JSON.parse(item) : null;
};

const setUser = (key: string, value: { user_name: string; token: string }) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const removeUser = (key: string) => {
  localStorage.removeItem(key);
};

export { getUser, setUser, removeUser };
