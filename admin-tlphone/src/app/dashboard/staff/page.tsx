
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CustomerBox from "@/components/Client/CustomerBox";

const CustomerPage = () => {
  return (
    <DefaultLayout>
      <CustomerBox />
    </DefaultLayout>
  );
};

export default CustomerPage;
