import { useContext } from "react";
import { DonorContext } from "../../contexts/donor/context";
import { useGetRecyclableDonorData } from "./hooks/useGetRecyclabeDonorData";
import { HomePageContent } from "./homePageContent";
import React from "react";
import { Loading } from "../../components/loading";
import { ErrorPage } from "../../components/ErrorPage";
import { useProfileImage } from "./hooks/useProfileImage";

export function Home({ }) {
  const { donorState } = useContext(DonorContext);
  const { image } = useProfileImage(donorState.photoUrl);
  const { data: recyclableDonorData, loading, error } = useGetRecyclableDonorData(donorState.id);
  
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorPage />;
  }
  return (
    <HomePageContent donorState={donorState} recyclableDonorData={recyclableDonorData} userImage={image} />
  );
}
