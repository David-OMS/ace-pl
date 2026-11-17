import type { Route } from "next";

import { Card } from "@/ui/card";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { adminCopy } from "../copy";
import type { AdminHomeSnapshot } from "../queries/get-admin-home-snapshot";

type AdminHomeSetupStepsProps = {
  snapshot: AdminHomeSnapshot;
  manageRosterHref: Route | null;
  createTeamHref: Route | null;
  fixturesHref: Route | null;
};

export function AdminHomeSetupSteps({
  snapshot,
  manageRosterHref,
  createTeamHref,
  fixturesHref,
}: AdminHomeSetupStepsProps): React.JSX.Element | null {
  const { home } = adminCopy;
  const steps: { done: boolean; label: string; href: Route | null }[] = [
    { done: snapshot.rosterCount > 0, label: home.setupRoster, href: manageRosterHref },
    { done: snapshot.teamCount > 0, label: home.setupTeams, href: createTeamHref },
    { done: snapshot.fixtureCount > 0, label: home.setupFixtures, href: fixturesHref },
  ];
  if (steps.every((step) => step.done)) return null;

  return (
    <Card className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y divide-line-soft">
        {steps.map((step) => (
          <li key={step.label} className="flex min-h-11 items-center gap-2 py-2">
            <span className={`w-10 text-xs font-bold ${step.done ? "text-win" : "text-hot"}`}>
              {step.done ? "Done" : "Next"}
            </span>
            {step.done || !step.href ? (
              <span className="text-sm font-bold text-muted">{step.label}</span>
            ) : (
              <SoftNavLink href={step.href} className="text-sm font-bold underline">
                {step.label}
              </SoftNavLink>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
