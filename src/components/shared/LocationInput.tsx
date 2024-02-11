import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import LocationIcon from "/icons/location.png";
import { ControllerRenderProps, UseFormSetValue } from "react-hook-form";

type PostPostValues = {
  tags: string[];
  caption: string;
  location: string;
  files: File[];
};

type LocationInputProps = {
  field: ControllerRenderProps<PostPostValues, "location">;
  setFormValue: UseFormSetValue<PostPostValues>;
};

const LocationInput = ({field,}: LocationInputProps) => {
  return (
    <div className="relative">
      <Input
        dir="ltr"
        type="text"
        className="shad-input pe-16"
        placeholder="تهران"
        {...field}
      />
      <Button
        className="absolute top-0 bottom-0 h-full start-0 z-10 w-12 p-0 ps-4"
        type="button"
        aria-label="لوکیشن"
      >
        <img src={LocationIcon} className="w-full" alt="لوکیشن" />
      </Button>
    </div>
  );
};

export default LocationInput;
