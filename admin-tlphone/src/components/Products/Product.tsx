"use client";
import Image from "next/image";
import {
  ColorDetailType,
  ImageDetailType,
  ProductType,
  ProductVariantType,
  SearchProductType,
  TagsDetailType,
} from "@/types/product";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import PropTypes, { element } from "prop-types";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

import {
  AddAAttribute,
  AddAColor,
  AddAllAttributes,
  AddAllColor,
  AddAVariant,
  AddListAttributes,
  AddListColor,
  AddListProduct,
  AddListVariants,
  AddProduct,
  RemoveAAttribute,
  RemoveAColor,
  RemoveAVariant,
  RemoveProduct,
  UpdateFilter,
} from "@/app/redux/features/product/product.redux";
import { toast } from "react-toastify";
import {
  createProductApi,
  deleteProductApi,
  getAllSchemaProductApi,
  getColorProductApi,
  getTagsProductApi,
  makeRequestApi,
  searchProductWithOptionsApi,
  updateProductApi,
  uploadFile,
} from "@/lib/api";
import { AddListCategory } from "@/app/redux/features/category/category.redux";
import { ItemSchemaProductDetailType, SchemaProductType } from "@/types";
import InputAddArea from "@/components/Input/InputAddArea";
import InputColor from "@/components/Input/inputColor";
import InputAddImei from "@/components/Input/InputAddImei";
import {
  ColorDetailInp,
  CreateProductDto,
  DeleteProductDto,
  ImageDetailInp,
  ProductVariantInp,
  SearchProductDto,
  TagsDetailInp,
  TagsProductDto,
  UpdateProductDto,
} from "@/lib/dtos/Product";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { Quill } from "react-quill";
import ResizeModule from "@ssumo/quill-resize-module";
import { Backend_URL } from "@/lib/Constants";
Quill.register("modules/resize", ResizeModule);

type FileDetail = {
  id: string;
  file: File;
};

const ProductBox = () => {
  const { data: session } = useSession();
  const productList = useAppSelector((state) => state.ProductRedux.value);
  const categoryList = useAppSelector((state) => state.CategoryRedux.value);
  const attributesInput = useAppSelector(
    (state) => state.ProductRedux.attributesInput,
  );
  const variantInput = useAppSelector(
    (state) => state.ProductRedux.variantInput,
  );
  const colorInput = useAppSelector((state) => state.ProductRedux.colorInput);
  const attributesList = useAppSelector(
    (state) => state.ProductRedux.attributesList,
  );
  const filter = useAppSelector((state) => state.ProductRedux.filter);
  const colorList = useAppSelector((state) => state.ProductRedux.colorList);
  const dispatch = useAppDispatch();
  const [productSelect, setProductSelect] = useState<ProductType | null>(null);
  const [typeForm, setTypeForm] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedImeiEdit, setSelectedImeiEdit] = useState<string[]>([]);
  const [productName, setProductName] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [images, setImages] = useState<ImageDetailType[]>([]);
  const [fileDetails, setFileDetails] = useState<FileDetail[]>([]);
  const [schemaProduct, setSchemaProduct] = useState<SchemaProductType | null>(
    null,
  );
  const [showCombinations, setShowCombinations] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const UpdateAllTag = async () => {
    const dtoTag: TagsProductDto = {
      tags: null,
    };
    const responseTags: TagsDetailType[] = await makeRequestApi(
      getTagsProductApi,
      dtoTag,
      session?.refresh_token,
      session?.access_token,
    );
    dispatch(AddAllAttributes(responseTags));

    const dtoColor: ColorDetailInp = {
      colorName: null,
    };
    const responseColors: ColorDetailType[] = await makeRequestApi(
      getColorProductApi,
      dtoColor,
      session?.refresh_token,
      session?.access_token,
    );
    dispatch(AddAllColor(responseColors));
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseProduct: SearchProductType = await makeRequestApi(
          searchProductWithOptionsApi,
          filter,
          session?.refresh_token,
          session?.access_token,
        );
        const responseCategory = await makeRequestApi(
          getAllSchemaProductApi,
          null,
          session?.refresh_token,
          session?.access_token,
        );
        await UpdateAllTag();
        dispatch(AddListCategory(responseCategory));
        dispatch(AddListProduct(responseProduct.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseProduct: SearchProductType = await makeRequestApi(
          searchProductWithOptionsApi,
          filter,
          session?.refresh_token,
          session?.access_token,
        );
        dispatch(AddListProduct(responseProduct.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [filter, dispatch]);

  const handleProductNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
  };

  const handleBrandChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBrand(event.target.value);
  };

  const generateCombinations = (
    attributes: Record<string, string[]>,
    variantInput: ProductVariantType[],
  ): ProductVariantType[] => {
    const keys = Object.keys(attributes);
    const values = keys.map((key) => attributes[key]);

    const combine = (arr: string[][], index: number): string[][] => {
      if (index >= arr.length) return [[]];
      const rest = combine(arr, index + 1);
      return arr[index].flatMap((item) =>
        rest.map((combo) => [item, ...combo]),
      );
    };

    const combinations = combine(values, 0);

    const newVariants = combinations.map((combination, idx) => {
      const updatedAttributes = combination.map((value, i) => ({
        id: `${Date.now() + i * 10}`,
        type: keys[i],
        value,
      }));

      return {
        id: `${Date.now() + idx}`,
        attributes: updatedAttributes,
        originPrice: 0,
        displayPrice: 0,
        stockQuantity: 0,
        hasImei: true,
        imeiList: [],
      } as ProductVariantType;
    });

    const allVariants = [...variantInput, ...newVariants];
    console.log(allVariants);
    const uniqueVariants = allVariants.filter((variant, index, self) => {
      return (
        self.findIndex((v) => {
          if (!v.attributes || !variant.attributes) return false;
          return v.attributes.every((att, i) => {
            return (
              variant.attributes &&
              variant.attributes[i]?.value?.toLowerCase() ===
                att?.value?.toLowerCase()
            );
          });
        }) === index
      );
    });

    return uniqueVariants;
  };

  const filterAttributesForSearch = (
    schemaProduct: SchemaProductType,
  ): ItemSchemaProductDetailType[] => {
    return schemaProduct.detail.flatMap((detail) =>
      detail.attributes.filter((attribute) => attribute.isUseForSearch),
    );
  };

  const handleShowCombinationsTable = () => {
    if (!schemaProduct) return;

    const aggList: ItemSchemaProductDetailType[] =
      filterAttributesForSearch(schemaProduct);

    const aggProcess: Record<string, string[]> = {
      color: colorInput.map((it) => it.colorName),
    };
    for (const item of aggList) {
      const filteredAttributes = attributesList.filter(
        (it) => it.type === item.value,
      );
      const attributeValues = filteredAttributes
        .map((attribute) => attribute.value)
        .filter((value): value is string => value !== undefined);
      aggProcess[item.value] = attributeValues;
    }
    const aggProcessed = generateCombinations(aggProcess, variantInput);

    dispatch(AddListVariants(aggProcessed));
    setShowCombinations(!showCombinations);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => {
      const id = `${Date.now()}`;
      const objectUrl = URL.createObjectURL(file);

      setFileDetails((prevFileDetails) => [...prevFileDetails, { id, file }]);

      return {
        id,
        url: objectUrl,
        link: [],
      };
    });

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleImageInfoChange = (id: string, info: string) => {
    const idx = images.findIndex((it) => it.id === id);
    if (idx === -1) {
      return;
    }

    const newImages = images.map((image, i) =>
      i === idx ? { ...image, link: [info] } : image,
    );
    setImages(newImages);
  };

  const deleteImage = (index: number) => {
    if (index < 0 || index >= images.length) return;

    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    const updatedFileDetails = fileDetails.filter((_, i) => i !== index);
    setFileDetails(updatedFileDetails);
  };

  const [description, setDescription] = useState<string>("");
  const handleChangeDescription = (html: any) => {
    setDescription(html);
  };

  const [tutorial, setTutorial] = useState<string>("");
  const handleChangeTutorial = (html: any) => {
    setTutorial(html);
  };

  useEffect(() => {
    if (productType === "") {
      setSchemaProduct(null);
      return;
    }
    const selectedCategory = categoryList.find(
      (item) => item.name === productType,
    );
    if (!selectedCategory) {
      setSchemaProduct(null);
      return;
    }
    setSchemaProduct(selectedCategory);
  }, [productType, categoryList]);

  const handleModal = (model: string, status: boolean) => {
    const modal = document.getElementById(
      model || "",
    ) as HTMLDialogElement | null;
    if (status) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  };

  const handleShow = (it: ProductType | null, model: string, type: string) => {
    handleModal(model, true);
    setTypeForm(type);
    setProductSelect(it);
    if (!it) {
      setProductName("");
      setBrand("");
      setDescription("");
      setTutorial("");
      setImages([]);
      setProductType("");
      dispatch(AddListAttributes([] as TagsDetailType[]));
      dispatch(AddListColor([] as ColorDetailType[]));
      dispatch(AddListVariants([] as ProductVariantType[]));
      return;
    }

    setProductName(it.name || "");
    setBrand(it.details?.brand?.value || "");
    setDescription(
      Buffer.from(it.details.description || "", "base64").toString("utf-8"),
    );
    setTutorial(
      Buffer.from(it.details.tutorial || "", "base64").toString("utf-8"),
    );
    setImages(it.details.imgDisplay || []);
    setProductType(it.category || "");
    dispatch(AddListAttributes(it.details.attributes || []));
    dispatch(AddListColor(it.details.color || []));
    dispatch(AddListVariants(it.details.variants || []));
  };

  const handleDeleteProduct = async (model: string) => {
    if (!productSelect) {
      toast.error("No product selected!");
      return;
    }

    const dto: DeleteProductDto = {
      productId: Number(productSelect.id || "-1"),
    };

    const dataReturn = await makeRequestApi(
      deleteProductApi,
      dto,
      session?.refresh_token,
      session?.access_token,
    );

    if (!dataReturn) {
      toast.error("Failed to delete product!");
      return;
    }

    toast.success("Delete product successfully!");
    dispatch(RemoveProduct(productSelect.id || ""));
    handleModal(model, false);
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmitControl = async () => {
    if (typeForm === "CREATE") {
      handleModal("my_modal_status", true);
      const imageDto: ImageDetailInp[] = [];
      for (let i = 0; i < images.length; i++) {
        const fileDetail = fileDetails.find((file) => file.id === images[i].id);
        if (!fileDetail) {
          toast.error(`File not found for image ${i}`);
          continue;
        }

        const responseImg = await makeRequestApi(
          uploadFile,
          fileDetail.file,
          session?.refresh_token,
          session?.access_token,
        );
        if (!responseImg) {
          setUploadMessage(`Failed to upload image!`);
          toast.error("Failed to upload image!");
          handleModal("my_modal_status", false);
          handleModal("my_modal_control", false);
          return;
        }
        imageDto.push({
          url: responseImg,
          link: images[i].link,
        } as ImageDetailInp);
        setUploadMessage(`Uploading Image ${i + 1}/${images.length}...`);
        await sleep(1000);
      }
      setUploadMessage(`Create a new product...`);

      const newProduct: CreateProductDto = {
        name: productName,
        category: productType,
        details: {
          imgDisplay: imageDto,
          brand: {
            type: "Brand",
            value: brand,
          },
          color: colorInput.map(
            (value) =>
              ({
                colorName: value.colorName,
                colorHex: value.colorHex,
              }) as ColorDetailInp,
          ),
          variants: variantInput.map(
            (value) =>
              ({
                hasImei: true,
                imeiList: value.imeiList,
                stockQuantity: value.stockQuantity,
                originPrice: value.originPrice,
                displayPrice: value.displayPrice,
                attributes: value.attributes,
              }) as ProductVariantInp,
          ),
          attributes: attributesInput.map(
            (value) =>
              ({
                type: value.type,
                value: value.value,
              }) as TagsDetailInp,
          ),
          description: description,
          tutorial: tutorial,
        },
      };

      const responseProduct: ProductType = await makeRequestApi(
        createProductApi,
        newProduct,
        session?.refresh_token,
        session?.access_token,
      );
      if (!responseProduct) {
        setUploadMessage(`Failed to create product!`);
        toast.error("Failed to create product!");
        handleModal("my_modal_status", false);
        handleModal("my_modal_control", false);
        return;
      }

      setUploadMessage(`Create product successfully!`);
      toast.success("Create product successfully!");
      dispatch(AddProduct(responseProduct));
      handleModal("my_modal_status", false);
      handleModal("my_modal_control", false);
    } else if (typeForm === "EDIT") {
      handleModal("my_modal_status", true);
      const imgNew = images.filter((it) => it.url.startsWith("blob:"));
      const imgOld = images.filter((it) => !it.url.startsWith("blob:"));
      const imageDto: ImageDetailInp[] = imgOld.map(
        (it) =>
          ({
            url: it.url,
            link: it.link,
          }) as ImageDetailInp,
      );

      for (let i = 0; i < imgNew.length; i++) {
        const fileDetail = fileDetails.find((file) => file.id === imgNew[i].id);
        if (!fileDetail) {
          toast.error(`File not found for image ${i}`);
          setUploadMessage(`Failed to upload image!`);
          continue;
        }
        const responseImg = await makeRequestApi(
          uploadFile,
          fileDetail.file,
          session?.refresh_token,
          session?.access_token,
        );
        if (!responseImg) {
          setUploadMessage(`Failed to upload image!`);
          toast.error("Failed to upload image!");
          handleModal("my_modal_status", false);
          handleModal("my_modal_control", false);
          return;
        }
        imageDto.push({
          url: responseImg,
          link: imgNew[i].link,
        } as ImageDetailInp);
        setUploadMessage(`Uploading Image ${i + 1}/${imgNew.length}...`);
        await sleep(1000);
      }

      setUploadMessage(`Create a new product...`);

      const newProduct: UpdateProductDto = {
        productId: Number(productSelect?.id || "-1"),
        name: productName,
        category: productType,
        details: {
          imgDisplay: imageDto,
          brand: {
            type: "Brand",
            value: brand,
          },
          color: colorInput.map(
            (value) =>
              ({
                colorName: value.colorName,
                colorHex: value.colorHex,
              }) as ColorDetailInp,
          ),
          variants: variantInput.map(
            (value) =>
              ({
                hasImei: true,
                imeiList: value.imeiList,
                stockQuantity: value.stockQuantity,
                originPrice: value.originPrice,
                displayPrice: value.displayPrice,
                attributes: value.attributes,
              }) as ProductVariantInp,
          ),
          attributes: attributesInput.map(
            (value) =>
              ({
                type: value.type,
                value: value.value,
              }) as TagsDetailInp,
          ),
          description: Buffer.from(description).toString("base64"),
          tutorial: Buffer.from(tutorial).toString("base64"),
        },
      };

      const responseProduct: ProductType = await makeRequestApi(
        updateProductApi,
        newProduct,
        session?.refresh_token,
        session?.access_token,
      );
      if (!responseProduct) {
        setUploadMessage(`Failed to update product!`);
        toast.error("Failed to update product!");
        handleModal("my_modal_status", false);
        handleModal("my_modal_control", false);
        return;
      }
      setUploadMessage(`Update product successfully!`);
      toast.success("Update product successfully!");
      dispatch(AddProduct(responseProduct));
      handleModal("my_modal_status", false);
      handleModal("my_modal_control", false);
    }
    await UpdateAllTag();
  };

  return (
    <div className="mt-2 flex flex-col gap-10">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex w-full">
          <input
            value={filter.name || ""}
            onChange={(e) =>
              dispatch(UpdateFilter({ ...filter, name: e.target.value }))
            }
            type="text"
            placeholder="Search product name"
            className="h-10 w-full rounded-l border-2 border-stroke bg-white px-3 text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Sort Filter */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Sort:</span>
          <select
            value={filter.sort || ""}
            onChange={(e) =>
              dispatch(UpdateFilter({ ...filter, sort: e.target.value }))
            }
            className="select select-ghost w-full max-w-xs font-bold"
          >
            <option disabled>Choose a sort type</option>
            <option value="updated_at_desc">Updated Date: Newest</option>
            <option value="updated_at_asc">Updated Date: Oldest</option>
            <option value="created_at_desc">Created Date: Newest</option>
            <option value="created_at_asc">Created Date: Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Range Money Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Price Range:</span>
          <div className="flex flex-col items-start gap-2">
            <input
              type="range"
              min={0}
              max={filter.rangeMoney?.[1] || 1000000}
              step="10"
              value={filter.rangeMoney?.[0] || 0}
              onChange={(e) => {
                const updatedRange = [
                  Number(e.target.value),
                  filter.rangeMoney?.[1] || 1000000,
                ];
                dispatch(UpdateFilter({ ...filter, rangeMoney: updatedRange }));
              }}
              className="range range-primary"
            />
            <div className="flex flex-col items-start gap-2">
              <span className="text-sm">
                Min: {filter.rangeMoney?.[0] || 0}
              </span>

              <span className="text-sm">
                Max: {filter.rangeMoney?.[1] || 1000000}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Brands:</span>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              Brands
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] rounded-box bg-base-100 p-2 shadow"
            >
              {attributesList
                .filter((it) => it.type.toLowerCase() === "brand")
                .map((it) => (
                  <li key={it.value} className="flex items-center gap-2">
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <span className="label-text">{it.value}</span>
                        <input
                          type="checkbox"
                          value={it.value}
                          checked={
                            filter.brand?.some((c) => c.value === it.value) ??
                            false
                          }
                          onChange={(e) => {
                            const updatedItem = e.target.checked
                              ? [
                                  ...(filter.brand || []),
                                  { type: it.type, value: it.value },
                                ]
                              : filter.brand?.filter(
                                  (c) => c.value !== it.value,
                                );
                            dispatch(
                              UpdateFilter({ ...filter, brand: updatedItem }),
                            );
                          }}
                          className="checkbox-info checkbox"
                        />
                      </label>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Color Filter */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Color:</span>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              Colors
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] rounded-box bg-base-100 p-2 shadow"
            >
              {colorList.map((color) => (
                <li key={color.colorName} className="flex items-center gap-2">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <span className="label-text">{color.colorName}</span>
                      <input
                        type="checkbox"
                        value={color.colorName}
                        checked={
                          filter.color?.some(
                            (c) => c.value === color.colorName,
                          ) ?? false
                        }
                        onChange={(e) => {
                          const updatedColors = e.target.checked
                            ? [
                                ...(filter.color || []),
                                { type: "color", value: color.colorName },
                              ]
                            : filter.color?.filter(
                                (c) => c.value !== color.colorName,
                              );
                          dispatch(
                            UpdateFilter({ ...filter, color: updatedColors }),
                          );
                        }}
                        className="checkbox-info checkbox"
                      />
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Category:</span>
          <select
            value={filter.category || ""}
            onChange={(e) =>
              dispatch(UpdateFilter({ ...filter, category: e.target.value }))
            }
            className="select select-ghost w-full max-w-xs font-bold"
          >
            <option disabled selected>
              Chosen a category
            </option>
            <option value="">All Categories</option>
            {categoryList.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Products List
          </h4>
          <button
            onClick={() => handleShow(null, "my_modal_control", "CREATE")}
            aria-label="Submit"
            className="btn btn-info h-4 w-26"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Thêm
          </button>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-1 flex items-center sm:col-span-2">
            <p className="font-medium">Product Name</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="font-medium">Company</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="font-medium">Category</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Sold</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Quantity/Imei</p>
          </div>
          <div className="col-span-1 flex items-center sm:col-span-2">
            <p className="font-medium">Controller</p>
          </div>
        </div>

        {productList.map((product, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-1 flex  items-center sm:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-12.5 w-15 rounded-md">
                  <Image
                    src={
                      product?.details?.imgDisplay?.length
                        ? Backend_URL + product.details.imgDisplay[0].url
                        : ""
                    }
                    width={60}
                    height={50}
                    alt="Product"
                  />
                </div>
                <p className="text-sm text-black dark:text-white">
                  {product?.name}
                </p>
              </div>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {product?.details?.brand?.value || ""}
              </p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {product?.category || ""}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-meta-3">{product?.buyCount}</p>
            </div>
            <div className="col-span-1 flex flex-col items-start">
              <p className="text-sm text-meta-3">
                Quantity:{" "}
                {product?.details.variants?.reduce(
                  (acc, it) => acc + (it.stockQuantity || 0),
                  0,
                )}
              </p>
              <p className="text-sm text-meta-3">
                IMEI:{" "}
                {product?.details.variants?.reduce(
                  (acc, it) => acc + (it.imeiList?.length || 0),
                  0,
                )}
              </p>
            </div>
            <div className="col-span-1 flex items-center gap-1 sm:col-span-2">
              <button
                aria-label="Submit"
                onClick={() => handleShow(product, "my_modal_view", "VIEW")}
                className="btn btn-info"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </button>

              <button
                aria-label="Submit"
                onClick={() => handleShow(product, "my_modal_control", "EDIT")}
                className="btn btn-success"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>

              <button
                aria-label="Submit"
                onClick={() => handleShow(product, "my_modal_delete", "DELETE")}
                className="btn btn-error"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <dialog id="my_modal_view" className="modal">
        <div className="modal-box h-[91%] max-h-[100rem] w-11/12 max-w-[100rem]">
          <form method="dialog" className="sticky top-0 z-[20]">
            <button className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
              ✕
            </button>
          </form>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="text-xl font-medium text-black dark:text-white">
                Product Form
              </h3>
            </div>
            <div>
              <div className="p-6.5">
                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-black dark:text-white">
                    Product name
                  </label>
                  <div className="text-base">{productName}</div>
                </div>

                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-black dark:text-white">
                    Brand
                  </label>
                  <div className="text-base">{brand}</div>
                </div>

                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-black dark:text-white">
                    Color
                  </label>
                  <div className="text-base">
                    {colorInput.map((item) => item.colorName).join(", ")}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-black dark:text-white">
                    Product Type
                  </label>
                  <div className="text-base">{productType}</div>
                </div>

                {schemaProduct && (
                  <div>
                    {schemaProduct.detail.map((detail, idx) => (
                      <div key={detail.id} className="mb-5">
                        <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                          {`${idx + 1}, ${detail.title}`}
                        </label>
                        {detail.attributes.map((attr) => (
                          <div key={attr.id} className="mb-3">
                            <div className="text-base">
                              {attr.value}:{" "}
                              {attributesList
                                .filter((it) => it.type === attr.value)
                                .map((v) => v.value)
                                .join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-6">
                  <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                    Description
                  </label>
                  <div
                    className="text-base"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                    Tutorial
                  </label>
                  <div
                    className="text-base"
                    dangerouslySetInnerHTML={{ __html: tutorial }}
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                    Images
                  </label>
                  <div className="flex flex-col text-center">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {images.map((image, index) => (
                        <div key={index} className="mt-4 flex flex-col gap-4">
                          <Image
                            src={
                              image.url.startsWith("blob:")
                                ? image.url
                                : Backend_URL + image.url
                            }
                            alt="Preview"
                            className="mb-4 h-full w-full"
                            width={100}
                            height={200}
                          />
                          <div className="text-base">{image?.link?.[0]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    <div className="text-base font-bold">#</div>
                    <div className="text-base font-bold">Attribute</div>
                    <div className="text-base font-bold">Origin Price</div>
                    <div className="text-base font-bold">Display Price</div>
                    <div className="text-base font-bold">Quantity</div>
                    <div className="text-base font-bold">Imei Count</div>

                    {variantInput &&
                      variantInput.length > 0 &&
                      variantInput.map((variant, idx) => (
                        <React.Fragment key={variant.id}>
                          <div className="text-base">{idx}</div>
                          <div className="text-base">
                            {variant.attributes
                              ?.map((attr) => attr.value)
                              .join(", ")}
                          </div>
                          <div className="text-base">{variant.originPrice}</div>
                          <div className="text-base">
                            {variant.displayPrice}
                          </div>
                          <div className="text-base">
                            {variant.stockQuantity}
                          </div>
                          <div className="text-base">
                            {variant?.imeiList?.length || 0}
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_control" className="modal ">
        <div className="modal-box h-[91%] max-h-[100rem] w-11/12 max-w-[100rem]">
          <form method="dialog" className="sticky top-0 z-[20]">
            <button className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
              ✕
            </button>
          </form>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Product Form
              </h3>
            </div>
            <div>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-lg font-medium text-black dark:text-white">
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

                <div className="mb-4.5">
                  <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                    Brand <span className="text-meta-1">*</span>
                  </label>
                  <input
                    value={brand}
                    onChange={handleBrandChange}
                    type="text"
                    placeholder="Name Brand"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="z-[11] mb-4.5">
                  <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                    Color <span className="text-meta-1">*</span>
                  </label>
                  <InputColor
                    itemsSelect={colorInput}
                    itemsList={colorList}
                    onAdd={(newColor: ColorDetailType) => {
                      dispatch(AddAColor(newColor));
                    }}
                    onRemove={(newColor: ColorDetailType) => {
                      dispatch(RemoveAColor(newColor));
                    }}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Product Type <span className="text-meta-1">*</span>
                  </label>

                  <div className="relative z-10 bg-transparent dark:bg-form-input">
                    <select
                      value={productType}
                      onChange={(e) => {
                        setProductType(e.target.value);
                      }}
                      className={`relative z-10 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        productType ? "text-black dark:text-white" : ""
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select your choice
                      </option>
                      {categoryList.map((item, index) => (
                        <option
                          key={index}
                          value={item.name}
                          className="text-body dark:text-bodydark"
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {schemaProduct && (
                  <div>
                    {schemaProduct.detail.map((detail, idx) => (
                      <div key={detail.id} className="mb-4.5">
                        <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                          {`${idx + 1}, ${detail.title}`}
                        </label>
                        {detail.attributes.map((attr) => (
                          <div key={attr.id} className="mb-3">
                            <div className="text-sm">{attr.value}</div>
                            <InputAddArea
                              itemsSelect={attributesInput.filter(
                                (it) => it.type === attr.value,
                              )}
                              itemsList={attributesList.filter(
                                (it) => it.type === attr.value,
                              )}
                              typeTag={attr.value}
                              onAdd={(newAttribute: TagsDetailType) => {
                                dispatch(AddAAttribute(newAttribute));
                              }}
                              onRemove={(removedAttribute: TagsDetailType) => {
                                dispatch(RemoveAAttribute(removedAttribute));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                    <div className="mb-6">
                      <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                        Description
                      </label>
                      <div>
                        <ReactQuill
                          theme={"snow"}
                          onChange={handleChangeDescription}
                          value={description}
                          modules={ProductBox.modules}
                          formats={ProductBox.formats}
                          bounds={".app"}
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                        Tutorial
                      </label>
                      <div>
                        <ReactQuill
                          theme={"snow"}
                          onChange={handleChangeTutorial}
                          value={tutorial}
                          modules={ProductBox.modules}
                          formats={ProductBox.formats}
                          bounds={".app"}
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="mb-3 block text-lg font-medium text-black dark:text-white">
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
                        <label
                          htmlFor="image-input"
                          className="btn btn-info rounded-md px-4 py-2"
                        >
                          ADD IMAGES
                        </label>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className="mt-4 flex flex-col gap-4"
                            >
                              <Image
                                src={
                                  image.url.startsWith("blob:")
                                    ? image.url
                                    : Backend_URL + image.url
                                }
                                alt="Preview"
                                className="mb-4 h-full w-full"
                                width={100}
                                height={200}
                              />
                              <select
                                value={image?.link?.[0] || ""}
                                onChange={(e) =>
                                  handleImageInfoChange(
                                    image.id,
                                    e.target.value,
                                  )
                                }
                                className="border-gray-300 w-full rounded-md border"
                              >
                                <option value="">Select option</option>
                                {colorInput.map((value, idx) => (
                                  <option
                                    key={value.id}
                                    value={value.colorName}
                                  >
                                    {value.colorName}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => deleteImage(index)}
                                className="btn btn-error"
                              >
                                Xóa ảnh
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleShowCombinationsTable}
                      className="mb-6 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                      Show Product Combinations
                    </button>
                    {showCombinations && (
                      <div className="mb-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
                          {/* Table headers */}
                          <div className="font-bold">#</div>
                          <div className="font-bold">Attribute</div>
                          <div className="font-bold">Origin Price</div>
                          <div className="font-bold">Display Price</div>
                          <div className="font-bold">Quantity</div>
                          <div className="font-bold">Imei Count</div>
                          <div className="font-bold">Controller</div>

                          {variantInput &&
                            variantInput.length > 0 &&
                            variantInput.map((variant, idx) => (
                              <React.Fragment key={variant.id}>
                                {/* Variant Row */}
                                <div>{idx}</div>
                                <div>
                                  {variant.attributes
                                    ?.map((attr) => attr.value)
                                    .join(", ")}
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    placeholder="Original Price"
                                    value={variant.originPrice || ""}
                                    onChange={(e) => {
                                      let newVariant: ProductVariantType = {
                                        ...variant,
                                      };
                                      const validNumber = /^[0-9]*\.?[0-9]+$/;
                                      if (validNumber.test(e.target.value)) {
                                        let newValue = e.target.value.replace(
                                          /^0+/,
                                          "",
                                        );
                                        if (newValue === "") newValue = "0";
                                        newVariant.originPrice =
                                          Number(newValue);
                                        dispatch(AddAVariant(newVariant));
                                      }
                                    }}
                                    className="input input-bordered input-primary w-full max-w-xs"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    placeholder="Display Price"
                                    value={variant.displayPrice || ""}
                                    onChange={(e) => {
                                      let newVariant: ProductVariantType = {
                                        ...variant,
                                      };
                                      const validNumber = /^[0-9]*\.?[0-9]+$/;
                                      if (validNumber.test(e.target.value)) {
                                        let newValue = e.target.value.replace(
                                          /^0+/,
                                          "",
                                        );
                                        if (newValue === "") newValue = "0";
                                        newVariant.displayPrice =
                                          Number(newValue);
                                        dispatch(AddAVariant(newVariant));
                                      }
                                    }}
                                    className="input input-bordered input-primary w-full max-w-xs"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={variant.stockQuantity || ""}
                                    onChange={(e) => {
                                      let newVariant: ProductVariantType = {
                                        ...variant,
                                      };
                                      const validNumber = /^[0-9]*\.?[0-9]+$/;
                                      if (validNumber.test(e.target.value)) {
                                        let newValue = e.target.value.replace(
                                          /^0+/,
                                          "",
                                        );
                                        if (newValue === "") newValue = "0";
                                        newVariant.stockQuantity =
                                          Number(newValue);
                                        dispatch(AddAVariant(newVariant));
                                      }
                                    }}
                                    className="input input-bordered input-primary w-full max-w-xs"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    placeholder="Imei count"
                                    value={variant?.imeiList?.length || 0}
                                    className="input input-bordered input-primary w-full max-w-xs"
                                    readOnly
                                  />
                                </div>
                                <div className="flex flex-row gap-2">
                                  <button
                                    className="btn btn-info"
                                    onClick={() =>
                                      setSelectedImeiEdit((pre) => {
                                        if (pre.includes(variant?.id)) {
                                          return pre.filter(
                                            (it) => it !== variant.id,
                                          );
                                        }
                                        return [...pre, variant.id];
                                      })
                                    }
                                  >
                                    Imei
                                  </button>
                                  <button
                                    className="btn btn-error"
                                    onClick={() =>
                                      dispatch(RemoveAVariant(variant))
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>

                                {/* IMEI input if selected */}
                                {selectedImeiEdit.includes(variant.id) && (
                                  <div className="col-span-7">
                                    <InputAddImei
                                      itemsSelect={variant?.imeiList || []}
                                      onChange={(item: string[]) => {
                                        let newVariant: ProductVariantType = {
                                          ...variant,
                                        };
                                        newVariant.imeiList = item;
                                        dispatch(AddAVariant(newVariant));
                                      }}
                                    />
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={async () => await handleSubmitControl()}
                  className="mt-2 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {typeForm}
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_status" className="modal z-[1000]">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Upload Status</h3>
          <p className="py-4 duration-200">{uploadMessage}</p>
        </div>
      </dialog>

      <dialog
        id="my_modal_delete"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <p className="py-1 text-3xl text-rose-500">
            Do you want to remove this product?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
            <button
              onClick={() => handleDeleteProduct("my_modal_delete")}
              className="btn btn-error"
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

ProductBox.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ align: ["right", "center", "justify"] }],
    ["link", "image", "video"],
    ["clean"],
    [
      {
        color: [
          "red",
          "black",
          "white",
          "orange",
          "yellow",
          "pink",
          "blue",
          "green",
          "purple",
        ],
      },
    ],
    [{ background: ["red", "#785412"] }],
  ],
  clipboard: {
    matchVisual: false,
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
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "color",
  "background",
];

ProductBox.propTypes = {
  placeholder: PropTypes.string,
};

export default ProductBox;
