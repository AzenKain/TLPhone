"use client";
import React, { useState } from 'react';
import { ItemSchemaProductDetailType } from "@/types";

interface MultiselectProps {
  items: ItemSchemaProductDetailType[];
  onAdd: (item: ItemSchemaProductDetailType) => void;
  onRemove: (item: ItemSchemaProductDetailType) => void;
  onToggleUseForSearch: (itemId: string) => void;
}

const InputAdd: React.FC<MultiselectProps> = ({ items, onAdd, onRemove, onToggleUseForSearch }) => {
  const [newTag, setNewTag] = useState<string>('');

  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleAddNewTag = () => {
    if (newTag && !items.some((item) => item.value === newTag)) {
      const newItem: ItemSchemaProductDetailType = {
        id: `${Date.now()}`,
        isUseForSearch: false,
        value: newTag,
      };
      onAdd(newItem);
      setNewTag('');
    }
  };

  return (
    <div className="autocomplete-wrapper">
      <div className="autocomplete mx-auto flex w-full flex-col items-center">
        <div className="w-full">
          <div className="relative flex flex-col items-center">
            <div className="w-full">
              <div className="my-2 flex rounded-sm border border-stroke bg-white dark:bg-boxdark dark:border-strokedark shadow-default p-1">
                <div className="flex flex-auto flex-wrap">
                  {items.map((tag) => (
                    <div
                      key={tag.id}
                      className="m-1 flex items-center justify-center rounded-full border border-teal-300 bg-teal-100 px-2 py-1 font-medium text-teal-700"
                    >
                      <div className="max-w-full flex-initial text-xs font-normal leading-none mr-2">
                        {tag.value}
                      </div>
                      <input
                        type="checkbox"
                        checked={tag.isUseForSearch}
                        onChange={() => onToggleUseForSearch(tag.id)} // Use the passed down onToggleUseForSearch function
                        className="checkbox"
                      />
                      <div className="flex flex-auto flex-row-reverse">
                        <div onClick={() => onRemove(tag)} className="cursor-pointer">
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
                    className="menu dropdown-content z-[20] w-52 overflow-y-visible rounded-box bg-base-100 p-2 shadow"
                  >
                    {items.map((item) => (
                      <li key={item.id}>
                        <a onClick={() => onAdd(item)}>{item.value}</a> {/* Use the passed down onAdd function */}
                      </li>
                    ))}
                    <li className="pt-2">
                      <input
                        type="text"
                        placeholder="Add new tag..."
                        value={newTag}
                        onChange={handleNewTagChange}
                        className="input input-bordered w-full"
                      />
                    </li>
                    <li>
                      <button
                        onClick={handleAddNewTag}
                        className="btn btn-primary btn-sm mt-2 w-full"
                      >
                        Add Tag
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

export default InputAdd;
