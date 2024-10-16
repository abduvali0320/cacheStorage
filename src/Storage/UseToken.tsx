export const UseToken = (key: string) => {
    const getItem = () => {
        try {
            let token = window.localStorage.getItem(key);
            return token ? JSON.parse(token) : undefined;
        } catch (error) {
            console.log(error);
        }
    };
    const setItem = (value: unknown) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };
    return { getItem, setItem };
};
