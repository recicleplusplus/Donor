import React, { useContext } from "react";
import { Loading } from "../../components/loading";
import { ErrorPage } from "../../components/ErrorPage";
import { useGetMaterials } from "../../hooks/useGetMaterials";
import PointsPageContent from "./poinstPageContent";
import { DonorContext } from "../../contexts/donor/context";

export function PointsPage() {
  const donorContext = useContext(DonorContext as any) as any;
  const donorState = donorContext?.donorState;
  const currentPoints = (donorState?.points ?? 0) as number;
  const { data, loading, error } = useGetMaterials();

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return <ErrorPage />;
  }

  return (
    <PointsPageContent materials={data} donorPoints={currentPoints} />
  );
}
