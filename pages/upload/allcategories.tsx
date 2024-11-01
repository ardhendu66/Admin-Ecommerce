import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import Layout from "@/components/Layout";
import CreateForm from "@/components/UploadForm/CreateForm";
import UpdateForm from "@/components/UploadForm/UpdateForm";
import { useRouter } from "next/router";
import { UploadItemType } from "@/config/UploadTypes";
import AllProducts from "@/components/uploadComponents/AllProducts";
import SingleProduct from "@/components/uploadComponents/SingleProduct";
import { toast } from "react-toastify";

export default function Smartphones() {
    const [product, setProduct] = useState<UploadItemType | null>(null);
    const [singleProduct, setSingleProduct] = useState<UploadItemType | null>(null);
    const [brandName, setBrandName] = useState<string>("");
    const [file, setFile] = useState<File | undefined>();
    const [previewUrl, setPreviewUrl] = useState<Set<string>>(new Set<string>());
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isNewBrandCreation, setIsNewBrandCreation] = useState<boolean>(false);
    const [showBrandImages, setShowBrandImages] = useState({index: -1, open: false});
    const router = useRouter();
    const { item } = router.query;
    const { data: session } = useSession();

    useEffect(() => {
        if (item) {
            fetchAllBrands();
        }
    }, [item]);

    const fetchAllBrands = () => {
        axios.get(`/api/upload/get?name=${item}`)
            .then((res) => {
                setSingleProduct(null);
                setProduct(res.data);
            })
            .catch((err: AxiosError) => {
                console.error(err.response);
            });
    };

    const fetchSingleBrand = () => {
        if(brandName === "") {
            toast("Please select one category", {position: "top-center"});
            return;
        }

        axios
            .get(`/api/upload/get?name=${item}&brand=${brandName}`)
            .then((res) => {
                setSingleProduct(res.data);
            })
            .catch((err: AxiosError) => {
                console.error(err.response);
            });
    }

    return (
        <Layout>
            {isNewBrandCreation ? (
                <div>
                    <h1 className="font-medium">New Brand Creation</h1>
                    <input
                        type="text"
                        placeholder="enter brand-name"
                        onChange={(e) => setBrandName(e.target.value)}
                    />
                    <CreateForm
                        name={item as string}
                        brandName={brandName as string}
                        previewUrl={previewUrl}
                        isUploading={isUploading}
                        file={file}
                        setFile={setFile}
                        setIsUploading={setIsUploading}
                        setPreviewUrl={setPreviewUrl}
                    />
                </div>
            ) : (
                <div>
                    <button
                        type="button"
                        className="bg-sky-700 py-3 mb-6 text-xl rounded-md min-w-full"
                        onClick={() => setIsNewBrandCreation(true)}
                    >
                        Create a new Brand
                    </button>

                    <select
                        value={brandName as string}
                        className="mb-6"
                        onChange={(e) => setBrandName(e.target.value)}
                    >
                        <option value="" className="ml-2">Select Brand</option>
                        {product?.brand.map(p => (
                            <option value={p.name} key={p._id} className="ml-2">
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => fetchSingleBrand()}
                        className="bg-sky-700 py-3 mb-6 text-xl rounded-md min-w-full"
                    >
                        Fetch brands
                    </button>

                    <UpdateForm
                        name={item as string}
                        brandName={brandName}
                        previewUrl={previewUrl}
                        isUploading={isUploading}
                        file={file}
                        setFile={setFile}
                        setIsUploading={setIsUploading}
                        setPreviewUrl={setPreviewUrl}
                        fetchAllBrands={fetchAllBrands}
                        product={product}
                    />

                    <div className="mb-5 border-b"></div>
                    { singleProduct !== null ? 
                        <SingleProduct 
                            item={item as string}
                            singleProduct={singleProduct}
                            fetchAllBrands={fetchSingleBrand}
                        /> :
                        <AllProducts
                            item={item as string}
                            product={product}
                            showBrandImages={showBrandImages}
                            setShowBrandImages={setShowBrandImages}
                            fetchAllBrands={fetchAllBrands}
                        />
                    }
                </div>
            )}
        </Layout>
    );
}
