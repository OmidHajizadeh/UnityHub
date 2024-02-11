import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ControllerRenderProps, UseFormSetValue } from "react-hook-form";

import DeleteIcon from "/icons/delete.svg";
import { Input } from "@/components/ui/input";
import { PostValues } from "@/types";

type TagsInputProps = {
  field: ControllerRenderProps<PostValues, "tags">;
  setFormValue: UseFormSetValue<PostValues>;
};

const TagsInput = ({ field, setFormValue }: TagsInputProps) => {
  const [tags, setTags] = useState(() => {
    return field.value.map((tag) => ({
      id: uuidv4(),
      value: tag,
    }));
  });
  const [inputValue, setInputValue] = useState("");

  function removeTagHandler(tagId: string) {
    const newTags = tags.filter((tag) => tag.id !== tagId);

    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== tagId);
    });

    setFormValue(
      "tags",
      newTags.map((tag) => tag.value)
    );
    setInputValue("");
  }

  function addTagHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" && e.key !== "Space") return;
    e.stopPropagation();
    e.preventDefault();

    if (e.currentTarget.value.trim().length === 0) {
      setInputValue("");
      return;
    }

    const newTag = e.currentTarget.value.trim().replace(/ /g, "_");
    setInputValue("");

    const doesTagAlreadyExist = tags.some((tag) => tag.value === newTag);

    if (doesTagAlreadyExist) {
      setInputValue("");
      return;
    }

    const newTags = tags;
    newTags.push({
      id: uuidv4(),
      value: newTag,
    });

    setTags(newTags);
    setFormValue(
      "tags",
      newTags.map((tag) => tag.value)
    );
    setInputValue("");
  }

  return (
    <ul
      dir="ltr"
      className="bg-dark-4 p-3 rounded-md flex items-center flex-wrap gap-3"
    >
      {tags.map((tag) => {
        return (
          <li
            onClick={removeTagHandler.bind(null, tag.id)}
            dir="ltr"
            className="bg-primary-400 flex items-center gap-1 shrink-0 text-white rounded-md px-2 py-1 cursor-pointer"
            key={tag.id}
          >
            <img
              src={DeleteIcon}
              alt="delete"
              width="16"
              height="16"
              className="invert brightness-0"
            />
            <span>|</span>
            {tag.value}
          </li>
        );
      })}
      <li className="grow">
        <Input
          dir="auto"
          type="text"
          className="h-8 bg-dark-4 border-none p-0 placeholder:text-light-4 focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={addTagHandler}
          placeholder="Meme"
          {...field}
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
        />
      </li>
    </ul>
  );
};

export default TagsInput;
