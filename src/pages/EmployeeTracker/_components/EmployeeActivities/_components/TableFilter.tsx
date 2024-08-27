import React from "react";
import { useSearchParams } from "react-router-dom";
import { MdSearch } from "react-icons/md";

import { Input } from "@/components/ui/input";

const TableFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchParams.set("search", e.target.value);
    setSearchParams(searchParams);
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchParams.set("date", e.target.value);
    setSearchParams(searchParams);
  };

  return (
    <div className="flex flex-row flex-wrap gap-2 p-1">
      <Input
        addonRight={
          <MdSearch
            className="h-[24px] w-[24px] bg-rs-v2-slate-blue"
            color="#8997A9"
          />
        }
        className="bg-rs-v2-slate-blue"
        type="search"
        placeholder="Search..."
        onChange={handleSearch}
      />
      <Input
        className="w-48 cursor-text bg-rs-v2-slate-blue focus-visible:ring-[1px]"
        type="date"
        placeholder="Date"
        onChange={handleDate}
      />
    </div>
  );
};

export default TableFilter;
