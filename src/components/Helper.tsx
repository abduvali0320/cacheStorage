import Swal from "sweetalert2";

export function useHelper() {
    const Notify = (val: any) => {
        const toast = Swal.mixin({
            toast: true,
            position: val.position,
            showConfirmButton: false,
            timer: val.timeout,
            showCloseButton: true,
            color: "success",
            customClass: {
                popup: val.color,
            },
        });
        toast.fire({
            title: val.message,
        });
    };

    return {
        Notify,
    };
}
