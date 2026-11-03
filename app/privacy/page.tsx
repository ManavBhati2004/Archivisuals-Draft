import type { Metadata } from "next";
import { PageStub } from "@/components/ui/PageStub";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return <PageStub title="Privacy" slate="Privacy" line="[PLACEHOLDER] How we handle the details you send us." phase={5} />;
}
