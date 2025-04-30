import React from "react";
import { prisma } from "@/lib/prisma";

const OverviewPage = async () => {
  const categories = await prisma.category.findMany();

  return (
    <div className="h-screen flex justify-center items-center">
      <h1>{JSON.stringify(categories, null, 2)}</h1>
    </div>
  );
};

export default OverviewPage;
