type LoadingProps = {
    load: boolean | undefined;
    timeLoad: boolean;
};
export default function Loading({ load, timeLoad = false }: LoadingProps) {
    if (load || timeLoad) {
        document.body.style.overflow = "hidden";
        return (
            <div className="loading">
                <div
                    className={`${timeLoad ? "bg_change" : ""} ` + "spinner"}
                ></div>
            </div>
        );
    }
    document.body.style.overflow = "auto";
    return "";
}
