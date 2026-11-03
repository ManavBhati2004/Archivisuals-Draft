import { Preloader } from "@/components/home/Preloader";
import { Arrival } from "@/components/home/Arrival";
import { Threshold } from "@/components/home/Threshold";
import { SelectedFilms } from "@/components/home/SelectedFilms";
import { WhatWeShoot } from "@/components/home/WhatWeShoot";
import { InTheGrade } from "@/components/home/InTheGrade";
import { RecentListings } from "@/components/home/RecentListings";
import { Process } from "@/components/home/Process";
import { Studio } from "@/components/home/Studio";
import { FinalFrame } from "@/components/home/FinalFrame";

/** Home — "The Walkthrough": from the street to the final frame. */
export default function Home() {
  return (
    <>
      <Preloader />
      <Arrival />
      <Threshold />
      <SelectedFilms />
      <WhatWeShoot />
      <InTheGrade />
      <RecentListings />
      <Process />
      <Studio />
      <FinalFrame />
    </>
  );
}
