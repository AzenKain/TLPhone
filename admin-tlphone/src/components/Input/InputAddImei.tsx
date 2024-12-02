"use client";
import React, { useState } from 'react';
import { TagsDetailType } from "@/types";
import useChatScroll from "@/hooks/useScrollChat";

interface MultiselectProps {
  itemsSelect: string[];
  onChange: (item: string[]) => void;
}

const InputAddImei: React.FC<MultiselectProps> = ({ itemsSelect, onChange }) => {
  const [newTag, setNewTag] = useState<string>(itemsSelect.join(', '));

  const handleAddNewTag = () => {
    const cleanedTag = newTag.replace(/\s+/g, ' ').trim(); // Remove extra spaces
    onChange([...cleanedTag.split(","), ...itemsSelect]);
    setNewTag("");
  };

  return (
    <div className="autocomplete-wrapper">
      <div className="autocomplete mx-auto flex w-full flex-col items-center">
        <div className="w-full">
          <div className="relative flex flex-col items-center">
            <div className="w-full">
              <div className="my-2 flex ounded-sm border border-stroke bg-white dark:bg-boxdark dark:border-strokedark shadow-default p-1">
                <div className="flex flex-auto flex-wrap">
                  {itemsSelect.map((tag, idx) => (
                    <div
                      key={idx}
                      className="m-1 flex items-center justify-center rounded-full border border-teal-300 bg-teal-100 px-2 py-1 font-medium text-teal-700"
                    >
                      <div className="mr-2 max-w-full flex-initial text-xs font-normal leading-none">
                        {tag}
                      </div>

                      <div className="flex flex-auto flex-row-reverse">
                        <div
                          onClick={() => onChange(itemsSelect.filter(it => it != tag))}
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
                      placeholder={`Add or select a imei...`}
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
                    className="menu dropdown-content z-[20] w-[50vh] md:w-[75vh] lg:w-[100vh] overflow-y-visible rounded-box bg-base-100 p-2 shadow"
                  >

                      <li className="pt-2">
                      <textarea
                        placeholder="Add new tag..."
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        className="textarea textarea-bordered textarea-lg w-full"
                      ></textarea>
                      </li>
                      <li>
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

export default InputAddImei;
