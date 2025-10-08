import React, { createContext, useContext, useMemo, useState } from "react";

const RoleCtx = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState("ML"); // "ML" | "Backend"
  const value = useMemo(() => ({ role, setRole }), [role]);
  return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}

