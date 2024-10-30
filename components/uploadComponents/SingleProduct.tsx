import axios from "axios";
import { UploadItemType } from "@/config/UploadTypes";
import { toast } from "react-toastify";

interface Props {
    item: string,
    singleProduct: UploadItemType | null,
    fetchAllBrands: () => void,
}

export default function SingleProduct({
    item,
    singleProduct,
    fetchAllBrands,
}: Props) {
    const deleteImagesOnClick = async (image: string, brand: string) => {
        try {
            const res = await axios.delete("/api/upload/delete", {
                data: {
                    name: item as string,
                    brand,
                    image,
                },
            });
            if (res.status === 202) {
                toast.success(`${res.data.message} 😊`, { position: "top-center" });
                fetchAllBrands();
            } else toast(`${res.data.message} 😕`, { position: "top-center" });
        } catch (err: any) {
            toast.error(err.message, { position: "top-center" });
        }
    };

    return (
        singleProduct !== null && singleProduct.brand.map((p, index) => {
            // console.log(p);
            return (
                <div
                    key={index}
                    className={`my-10 border-[1.4px] p-3 rounded ${p.images.length > 0 ? "border-gray-300" : "border-none"}`}
                >
                    {p.images.length > 0 && (
                        <div className="text-xl font-bold mb-4">{p.name} Brand</div>
                    )}
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 xsm:grid-cols-2 max-xsm:grid-cols-1 gap-2 py-1">
                        {p.images.map((img: string, ind: number) => (
                            <div className="col-span-1" key={ind}>
                                <div className="relative border border-gray-500 rounded-sm w-full h-60">
                                    <img
                                        src={img}
                                        alt="error"
                                        className="w-full h-full rounded-sm p-5"
                                    />
                                </div>
                                <div className="flex justify-between gap-1 mt-1 mb-2">
                                    <button
                                        type="button"
                                        className="w-1/2 bg-red-600 text-white py-1"
                                        onClick={() => deleteImagesOnClick(img, p.name)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className="w-1/2 bg-gray-700 text-white py-1"
                                        onClick={() => {
                                            window.navigator.clipboard.writeText(img);
                                            toast.success("Copied to clipboard", {
                                                position: "top-center",
                                            });
                                        }}
                                    >
                                        {" "}
                                        Copy-Link{" "}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })
    )
}