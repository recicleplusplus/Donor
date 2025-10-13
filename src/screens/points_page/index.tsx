import React from "react";
import { Loading } from "../../components/loading";
import { ErrorPage } from "../../components/ErrorPage";
import { useGetMaterials } from "../../hooks/useGetMaterials";
import PointsPageContent from "./poinstPageContent";

export function PointsPage({ route }: { route: any }) {
  const { donorPoints = 0 } = route.params || {};
  const { data, loading, error } = useGetMaterials();

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return <ErrorPage />;
  }

  return (
    <PointsPageContent materials={data} donorPoints={donorPoints} />
  );
}
