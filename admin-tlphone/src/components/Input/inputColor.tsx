"use client";
import React, { useState } from 'react';
import { ColorDetailType } from "@/types";
import useChatScroll from "@/hooks/useScrollChat";

interface MultiselectProps {
  itemsSelect: ColorDetailType[];
  itemsList: ColorDetailType[];
  onAdd: (item: ColorDetailType) => void;
  onRemove: (item: ColorDetailType) => void;
}

const InputColor: React.FC<MultiselectProps> = ({ itemsSelect, itemsList, onAdd, onRemove }) => {
  const [colorName, setNewTag] = useState<string>('');
  const [colorHex, setColorHex] = useState("#aabbcc");
  const [colorList, setColorList] = useState<ColorDetailType[]>(itemsList);

  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const ref = useChatScroll(colorList);

  const handleAddNewTag = () => {
    if (colorName && !itemsSelect.some((item) => item.colorName === colorName)) {
      const newItem: ColorDetailType = {
        id: `${Date.now()}`,
        colorHex: colorHex,
        colorName: colorName,
      };
      onAdd(newItem);
      setColorList([...colorList, newItem])
      setNewTag('');
    }
  };

  return (
    <div className="autocomplete-wrapper">
      <div className="autocomplete mx-auto flex w-full flex-col items-center">
        <div className="w-full">
          <div className="relative flex flex-col items-center">
            <div className="w-full">
              <div className="my-2 flex ounded-sm border border-stroke bg-white dark:bg-boxdark dark:border-strokedark shadow-default p-1">
                <div className="flex flex-auto flex-wrap">
                  {itemsSelect.map((tag) => (
                    <div
                      key={tag.id}
                      className="m-1 flex items-center justify-center rounded-full border border-teal-300 bg-teal-100 px-2 py-1 font-medium text-teal-700"
                    >
                      <div className="mr-1 max-w-full flex-initial text-xs font-normal leading-none">
                        {tag.colorName}
                      </div>
                      <div
                        className={`mr-1 h-6 w-6 rounded-md`}
                        style={{ backgroundColor: tag.colorHex }}
                      ></div>
                      <div className="flex flex-auto flex-row-reverse">
                        <div
                          onClick={() => onRemove(tag)}
                          className="cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x ml-2 h-4 w-4 hover:text-teal-400"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex-1">
                    <input
                      placeholder="Add or select a tag..."
                      disabled={true}
                      className="text-gray-800 h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                    />
                  </div>
                </div>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn m-1">
                    Add
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content z-[20] w-[30vh] overflow-y-auto rounded-box bg-base-100 p-2 shadow md:w-[50vh] lg:w-[75vh]"
                  >
                    <div ref={ref} className="max-h-[30vh] overflow-y-auto">
                      {colorList.map((item) => (
                        <li key={item.id} className="mb-2">
                          <a
                            className="text-2xl flex flex-row gap-2 items-center"
                            onClick={() => onAdd(item)}
                          >
                            {item.colorName}
                            <div
                              className={`h-6 w-6 rounded-md`}
                              style={{ backgroundColor: item.colorHex }}
                            ></div>
                          </a>
                        </li>
                      ))}
                    </div>

                    <li>
                      <div className="flex w-full flex-col items-center justify-center bg-transparent ">
                        <div
                          className="card flex w-full flex-col items-center justify-center rounded-lg bg-white p-2 shadow-lg">
                          <input
                            type="color"
                            value={colorHex}
                            onChange={(e) => setColorHex(e.target.value)}
                            className="border-gray-300 h-24 w-48 cursor-pointer focus:outline-none"
                          />
                          <div className="mt-4">
                            <p className="text-xl">
                              Selected Color: {colorHex}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="flex flex-row gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add new color..."
                        value={colorName}
                        onChange={handleNewTagChange}
                        className="input input-bordered w-full"
                      />
                      <button
                        onClick={handleAddNewTag}
                        className="btn btn-primary btn-sm mt-2 w-full"
                      >
                        Add
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputColor;
