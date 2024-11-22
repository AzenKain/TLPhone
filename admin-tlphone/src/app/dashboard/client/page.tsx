
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ClientBox from "@/components/Client/ClientBox";

const ClientPage = () => {
  return (
    <DefaultLayout>
      <ClientBox />
    </DefaultLayout>
  );
};

export default ClientPage;
