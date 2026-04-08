"use client";

import { useAuth } from "@clerk/nextjs";
import { PLANS, PLAN_LIMITS, PlanType } from "@/lib/subscription-constants";
import { useMemo } from "react";

export function usePlan() {
  const { has, isLoaded, userId } = useAuth();

  const plan = useMemo((): PlanType => {
    if (!isLoaded || !userId) return PLANS.FREE;

    if (has?.({ plan: "pro" })) return PLANS.PRO;
    if (has?.({ plan: "standard" })) return PLANS.STANDARD;

    return PLANS.FREE;
  }, [has, isLoaded, userId]);

  return {
    plan,
    limits: PLAN_LIMITS[plan],
    isPro: plan === PLANS.PRO,
    isStandard: plan === PLANS.STANDARD,
    isFree: plan === PLANS.FREE,
  };
}
