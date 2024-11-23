'use client'
import Image from "next/image";
import { ProductType } from "@/types/product";
import { ChangeEvent, useEffect, useState } from "react";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes, { element } from 'prop-types';
import ResizeModule from "@ssumo/quill-resize-module";
// import { makeRequestApi, addProductApi, getAllProductApi, editProductApi, deleteProductApi } from "@/lib/api";
import { useSession } from "next-auth/react";
// import { IImage, addProductDto, deleteProductDto, editProductDto } from "@/lib/dtos/product";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { AddListProduct, AddProduct, RemoveProduct, SearchProduct } from "@/app/redux/features/product/product.redux";

const ProductBox = () => {
  const { data: session } = useSession()
  const productList = useAppSelector((state) => state.ProductRedux.value)
  const dispatch = useAppDispatch()
  const [productSelect, setProductSelect] = useState<number>(0);
  const [typeForm, setTypeForm] = useState<string>("");

  const [searchValue, setSearchValue] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

  const handleSearch = () => {
    dispatch(SearchProduct({ value: searchValue, filter: searchFilter }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData: ProductType[] = await getAllProductApi();
        dispatch(AddListProduct(responseData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch])


  const [productName, setProductName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [company, setCompany] = useState<string>("");
  const [material, setMaterial] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [sizes, setSizes] = useState<string>("");
  const [colors, setColors] = useState<string>("");

  const handleProductNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(event.target.value));
  };

  const handleCostChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCost(parseFloat(event.target.value));
  };

  const handleStockQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStockQuantity(parseInt(event.target.value));
  };

  const handleCompanyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCompany(event.target.value);
  };

  const handleMaterialChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMaterial(event.target.value);
  };

  const handleTagsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value);
  };

  const handleSizesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSizes(event.target.value);
  };

  const handleColorsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setColors(event.target.value);
  };

  const [productType, setProductType] = useState<string>("")
  const elementSelect = {
    element: ["Shirt", "Pant", "Dress", "Accessories"],
  }
  const [images, setImages] = useState<IImage[]>([]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise<IImage>((resolve) => {
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve({ url: reader.result, link: [] });
          }
        };
      });
    });

    Promise.all(newImages).then((data) => {
      setImages([...images, ...data]);
    });
  };

  const handleImageInfoChange = (index: number, info: string) => {
    const updatedImages = [...images];
    updatedImages[index].link = info.split(",").map(items => items.trim().toLowerCase());
    setImages(updatedImages);
  };

  const deleteImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const [editorHtml, setEditorHtml] = useState<string>('');
  const handleChange = (html: any) => {
    setEditorHtml(html);
    console.log(html)
  };

  const useResize = () => {
    Quill.register("modules/resize", ResizeModule);
  }
  useResize();

  const handleShow = (key: number, model: string, type: string) => {
    const modal = document.getElementById(model) as HTMLDialogElement | null;

    if (key !== -1 && productList[key]) {
      const product = productList[key];
      setProductName(product.productName || '');
      setPrice(product.price || 0);
      setColors(product.color ? product.color.join(", ") : '');
      setSizes(product.size ? product.size.join(", ") : '');
      setMaterial(product.detail?.materials ? product.detail.materials.join(", ") : '');
      setTags(product.detail?.tags ? product.detail.tags.join(", ") : '');
      setCompany(product.detail?.company || '');
      setEditorHtml(product.description || '');
      setImages(product.imgDisplay || []);
      setCost(product.cost || 0);
      setStockQuantity(product.stockQuantity || 0);
      setProductType(product.productType || '');
    } else {
      setProductName('');
      setPrice(0);
      setColors('');
      setSizes('');
      setMaterial('');
      setTags('');
      setCompany('');
      setEditorHtml('');
      setImages([]);
      setCost(0);
      setStockQuantity(0);
      setProductType("")
    }

    if (modal) {
      modal.showModal();
      setTypeForm(type)
      setProductSelect(key)
    }
  }

  const handleDeleteProduct = async (model: string) => {
    let dataReturn = null;
    const selectedProduct = productList[productSelect];
    if (!selectedProduct || !selectedProduct.id) return;
    let dto: deleteProductDto = {
      productId: selectedProduct.id,
    }
    dataReturn = await makeRequestApi(deleteProductApi, dto, session?.refresh_token, session?.access_token);
    if (dataReturn !== null) {
      const modal = document.getElementById(model || '') as HTMLDialogElement | null;
      if (modal) {
        modal.close();
        dispatch(RemoveProduct(selectedProduct.id))
      }
    }
  }

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>, model: string) => {
    event.preventDefault();
    let dataReturn = null;
    if (typeForm === "CREATE") {
      let dto: addProductDto = {
        productName: productName,
        price: price,
        cost: cost,
        stockQuantity: stockQuantity,
        productType: productType,
        color: colors.split(",").map(items => items.trim().toLowerCase()),
        size: sizes.split(",").map(items => items.trim().toLowerCase()),
        detail: {
          tags: tags.split(",").map(items => items.trim().toLowerCase()),
          company: company,
          materials: material.split(",").map(items => items.trim().toLowerCase()),
        },
        description: editorHtml,
        imgDisplay: images
      }
      console.log(dto);
      dataReturn = await makeRequestApi(addProductApi, dto, session?.refresh_token, session?.access_token);
    }
    else if (typeForm == "EDIT") {
      let dto: editProductDto = {
        productId: productList[productSelect].id,
        productName: productName,
        price: price,
        cost: cost,
        stockQuantity: stockQuantity,
        productType: productType,
        color: colors.split(",").map(items => items.trim().toLowerCase()),
        size: sizes.split(",").map(items => items.trim().toLowerCase()),
        detail: {
          tags: tags.split(",").map(items => items.trim().toLowerCase()),
          company: company,
          materials: material.split(",").map(items => items.trim().toLowerCase()),
        },
        description: editorHtml,
        imgDisplay: images
      }
      dataReturn = await makeRequestApi(editProductApi, dto, session?.refresh_token, session?.access_token);
    }
    if (dataReturn !== null) {
      const modal = document.getElementById(model) as HTMLDialogElement | null;
      if (modal) {
        modal.close();
        dispatch(AddProduct(dataReturn))
      }
    }
  }

  return (
    <div className="flex flex-col gap-10 mt-2">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex w-full">
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search for the tool you like"
            className="w-full text-black dark:text-white  px-3 h-10 rounded-l border-2 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
          />
          <button
            onClick={() => handleSearch()}
            type="submit"
            className="bg-sky-500 text-black dark:text-white rounded-r px-2 md:px-3 py-0 md:py-1"
          >
            Search
          </button>
        </div>
        <select
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          id="pricingType"
          name="pricingType"
          className="h-10 border-2 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-black dark:text-white rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          <option value="all">All</option>
          <option value="id">Id</option>
          <option value="productName">Product name</option>
          <option value="productType">Product type</option>
          <option value="company">Company</option>
        </select>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

        <div className="flex justify-between px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Products List
          </h4>
          <button onClick={() => handleShow(-1, "my_modal_control", "CREATE")} aria-label="Submit" className="btn btn-info w-26 h-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Thêm
          </button>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Product Name</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="font-medium">Company</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Price</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Cost</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Sold</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Controller</p>
          </div>
        </div>

        {productList.map((product, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-12.5 w-15 rounded-md">
                  <Image
                    src={product?.imgDisplay[0]?.url}
                    width={60}
                    height={50}
                    alt="Product"
                  />
                </div>
                <p className="text-sm text-black dark:text-white">
                  {product?.productName}
                </p>
              </div>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {product?.detail?.company}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {product?.price}đ
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">{product?.cost}đ</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-meta-3">{product?.buyCount}</p>
            </div>
            <div className="col-span-2 flex items-center gap-1">

              <button aria-label="Submit" onClick={() => handleShow(key, "my_modal_view", "VIEW")} className="btn btn-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
                </svg>

              </button>

              <button aria-label="Submit" onClick={() => handleShow(key, "my_modal_control", "EDIT")} className="btn btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>

              <button aria-label="Submit" onClick={() => handleShow(key, "my_modal_delete", "DELETE")} className="btn btn-error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <dialog id="my_modal_view" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
              <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2 text-3xl">✕</button>
            </form>
            <div className="mt-4">
              <div>
                <h2 className="mt-2 font-semibold text-lg">{productList[productSelect]?.productName}</h2>
                <p className="mt-2">Cost: {productList[productSelect]?.cost}</p>
                <p className="mt-2">Price: {productList[productSelect]?.price}</p>
                <p className="mt-2">Stock Quantity: {productList[productSelect]?.stockQuantity}</p>
                <h3 className="mt-2">Product Details:</h3>
                <ul>
                  <li className="mt-2">Tags: {productList[productSelect]?.detail?.tags.join(', ')}</li>
                  <li className="mt-2">Company: {productList[productSelect]?.detail?.company}</li>
                  <li className="mt-2">Materials: {productList[productSelect]?.detail?.materials.join(', ')}</li>
                </ul>
                {productList[productSelect]?.sales && (
                  <div className="mt-2">
                    <h3>Sales Information:</h3>
                    <p className="mt-2">On Sale: {productList[productSelect]?.sales?.isSales ? 'Yes' : 'No'}</p>
                    <p className="mt-2">Discount Percentage: {productList[productSelect]?.sales?.percents}%</p>
                    <p className="mt-2">Sale End Date: {new Date(productList[productSelect]?.sales?.end ?? "").toLocaleDateString()}</p>
                  </div>
                )}
                <h3 className="mt-2">Product Images:</h3>
                <div className="flex gap-2 mt-2">
                  {productList[productSelect]?.imgDisplay.map((image, index) => (
                    <Image 
                      width={200}
                      height={200}
                      key={index} 
                      src={image?.url} 
                      alt={`Product Image ${index + 1}`} 
                      style={{ maxWidth: '200px' }} 
                    />
                  ))}
                </div>
                <p className="font-semibold mt-2">Description: </p>
                <div className="mt-2" dangerouslySetInnerHTML={{ __html: productList[productSelect]?.description ?? "" }} />



              </div>
            </div>
          </div>
        </dialog>

        <dialog id="my_modal_control" className="modal ">
          <div className="modal-box w-11/12 max-w-5xl">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Product Form
                </h3>
              </div>
              <form onSubmit={async (e) => await handleAddProduct(e, "my_modal_control",)}>
                <div className="p-6.5">

                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Product name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={productName}
                      onChange={handleProductNameChange}
                      type="text"
                      placeholder="Enter the name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Price <span className="text-meta-1">*</span>
                      </label>
                      <input
                        value={price}
                        onChange={handlePriceChange}
                        type="number"
                        placeholder="Enter the price"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Cost <span className="text-meta-1">*</span>
                      </label>
                      <input
                        value={cost}
                        onChange={handleCostChange}
                        type="number"
                        placeholder="Enter the cost"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Stock quantity <span className="text-meta-1">*</span>
                      </label>
                      <input
                        value={stockQuantity}
                        onChange={handleStockQuantityChange}
                        type="number"
                        placeholder="Enter the quantity"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Company <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={company}
                      onChange={handleCompanyChange}
                      type="text"
                      placeholder="Name company"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Product Type{" "}<span className="text-meta-1">*</span>
                    </label>

                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        value={productType}
                        onChange={(e) => {
                          setProductType(e.target.value)
                        }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${productType ? "text-black dark:text-white" : ""
                          }`}
                      >
                        <option value="" disabled className="text-body dark:text-bodydark">
                          Select your choice
                        </option>
                        {elementSelect.element.map((item, index) => (
                          <option key={index} value={item} className="text-body dark:text-bodydark">
                            {item}
                          </option>
                        ))}
                      </select>

                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill=""
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Material <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={material}
                      onChange={handleMaterialChange}
                      type="text"
                      placeholder="List material. Ex: cotton, 50%-cotton-30%-silk"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Tag <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={tags}
                      onChange={handleTagsChange}
                      type="text"
                      placeholder="List tags. Ex: men, polo..."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Size <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={sizes}
                      onChange={handleSizesChange}
                      type="text"
                      placeholder="List size. Ex: s, m, l, xl..."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Color <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={colors}
                      onChange={handleColorsChange}
                      type="text"
                      placeholder="List color. Ex: red, green, #12ff2..."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Description
                    </label>
                    <div data-theme="light">
                      <ReactQuill
                        theme={'snow'}
                        onChange={handleChange}
                        value={editorHtml}
                        modules={ProductBox.modules}
                        formats={ProductBox.formats}
                        bounds={'.app'}
                      />
                    </div>

                  </div>
                  <div className="mb-6">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Images
                    </label>
                    <div className="flex flex-col text-center">
                      <input
                        type="file"
                        id="image-input"
                        accept="image/*"
                        onChange={handleImageChange}
                        multiple
                        className="hidden"
                      />
                      <label htmlFor="image-input" className="btn btn-info px-4 py-2 rounded-md">
                        ADD IMAGES
                      </label>
                      {images.map((image, index) => (
                        <div key={index} className="image-container mt-4">
                          <Image
                            src={image.url}
                            alt="Preview"
                            className="w-full h-full mb-4"
                            width={100}
                            height={200}
                          />

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={image.link}
                              onChange={(e) => handleImageInfoChange(index, e.target.value)}
                              placeholder="Href. Ex: xl, green, l..."
                              className="border border-gray-300 px-4 py-2 rounded-md w-full"
                            />
                            <button onClick={() => deleteImage(index)} className="btn btn-error">
                              Xóa ảnh
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    {typeForm}
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-error">Close</button>
              </form>
            </div>
          </div>
        </dialog>

        <dialog id="my_modal_delete" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <p className="py-1 text-3xl text-rose-500">Do you want to remove this product?</p>

            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
              <button onClick={() => handleDeleteProduct("my_modal_delete")} className="btn btn-error">Delete</button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

ProductBox.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    [{ align: ["right", "center", "justify"] }],
    ['link', 'image', 'video'],
    ['clean'],
    [{ color: ["red", "black", "white", "orange", "yellow", "pink", "blue", "green", "purple"] }],
    [{ background: ["red", "#785412"], }]
  ],
  clipboard: {
    matchVisual: false
  },
  resize: {
    locale: {
      altTip: "Hold down the alt key to zoom",
      inputTip: "回车键确认",
      floatLeft: "Left",
      floatRight: "Right",
      center: "Center",
      restore: "Restore",
    },
  },
};

ProductBox.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  "align",
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  "color",
  "background",
];

ProductBox.propTypes = {
  placeholder: PropTypes.string,
};

export default ProductBox;