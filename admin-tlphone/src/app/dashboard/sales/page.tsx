'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SalesBox from "@/components/Sales/Sales";

const TablesPage = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div> */}
      <SalesBox/>
    </DefaultLayout>
  );
};

export default TablesPage;
