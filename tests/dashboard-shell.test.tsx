import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardShell } from "../src/components/DashboardShell";

const signOut = vi.fn();
const navigate = vi.fn();

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({ signOut, isSuperAdmin: true }),
}));

vi.mock("../src/lib/navigation", () => ({
  appHref: (path: string) => "/scale-smart-boost/#" + path,
  navigate: (...args: any[]) => navigate(...args),
}));

describe("DashboardShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signOut.mockResolvedValue(undefined);
  });

  it("usa rotas seguras no menu", () => {
    render(<DashboardShell title="Teste" eyebrow="Painel"><div>conteúdo</div></DashboardShell>);
    expect(screen.getByRole("link", { name: /Super admin/i })).toHaveAttribute("href", "/scale-smart-boost/#/admin");
    expect(screen.getByRole("link", { name: /^Catálogo$/i })).toHaveAttribute("href", "/scale-smart-boost/#/painel");
    expect(screen.getByRole("link", { name: /Ver catálogo/i })).toHaveAttribute("href", "/scale-smart-boost/#/barbearia-do-ze");
  });

  it("faz logout e volta ao login", async () => {
    render(<DashboardShell title="Teste" eyebrow="Painel"><div>conteúdo</div></DashboardShell>);
    fireEvent.click(screen.getByRole("button", { name: /Sair/i }));
    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));
    expect(navigate).toHaveBeenCalledWith("/auth");
  });
});
