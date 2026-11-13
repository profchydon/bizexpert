"use client";
import React from "react";
import SelectCountryForm from "./SelectCountryForm";
import SelectCountryPageHeader from "./SelectCountryPageHeader";

const SelectCountryContainer = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-25">
      <main className="flex flex-1 flex-col gap-8 pt-8 pb-14 sm:pt-12 sm:pb-24">
        <SelectCountryPageHeader />
        <SelectCountryForm />
      </main>
    </div>
  );
};

export default SelectCountryContainer;
