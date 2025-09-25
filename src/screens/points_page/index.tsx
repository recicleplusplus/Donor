import { useContext } from "react";
import { DonorContext } from "../../contexts/donor/context";
import React from "react";
import { Loading } from "../../components/loading";
import { ErrorPage } from "../../components/ErrorPage";
import { useGetRecyclableDonorData } from "../home/hooks/useGetRecyclabeDonorData";
import { useGetMaterials } from "../../hooks/useGetMaterials";
import PointsPageContent from "./poinstPageContent";

export function Home({ }) {
  const { donorState } = useContext(DonorContext);
  const { data, loading, error} = useGetMaterials();
  
  if (loading) {
    return <Loading />;
  }
  
  if (error || !data) {
    return <ErrorPage />;
  }

  return (
    <PointsPageContent materials={data} donorPoints={donorState.points} />
  );
}
