import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminDashboard } from "../src/pages/AdminDashboard";
import * as api from "../src/lib/api";

vi.mock("../src/components/DashboardShell", () => ({
  DashboardShell: ({ action, children }: any) => <div>{action}{children}</div>,
}));

vi.mock("../src/lib/api", () => ({
  getBusinesses: vi.fn(),
  inviteOwner: vi.fn(),
  saveBusiness: vi.fn(),
  toggleBusiness: vi.fn(),
  uploadCatalogImage: vi.fn(),
}));

const business = {
  id: "b1",
  slug: "barbearia-do-ze",
  name: "Barbearia do Zé",
  subtitle: "Demo",
  description: "Demo",
  primary_color: "#294a41",
  accent_color: "#f4c96b",
  logo_url: null,
  type: "services",
  whatsapp: "5511999999999",
  business_hours: "Hoje até 19h",
  is_active: true,
  created_at: new Date().toISOString(),
};

describe("AdminDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getBusinesses).mockResolvedValue([business] as any);
    vi.mocked(api.saveBusiness).mockResolvedValue(business as any);
    vi.mocked(api.inviteOwner).mockResolvedValue({ ok: true } as any);
    vi.mocked(api.toggleBusiness).mockResolvedValue(undefined);
  });

  it("abre e salva uma nova empresa", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: /Criar empresa/i }));

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Café QA" } });
    expect((screen.getByLabelText(/Link \/ slug/i) as HTMLInputElement).value).toBe("cafe-qa");

    fireEvent.click(screen.getByRole("button", { name: /^Salvar$/i }));

    await waitFor(() => expect(api.saveBusiness).toHaveBeenCalledTimes(1));
    expect(api.saveBusiness).toHaveBeenCalledWith(expect.objectContaining({
      name: "Café QA",
      slug: "cafe-qa",
      is_active: true,
    }));
  });

  it("abre e salva edição de empresa", async () => {
    render(<AdminDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: /Editar/i }));
    expect(screen.getByDisplayValue("Barbearia do Zé")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Subtítulo"), { target: { value: "Novo subtítulo" } });
    fireEvent.click(screen.getByRole("button", { name: /^Salvar$/i }));

    await waitFor(() => expect(api.saveBusiness).toHaveBeenCalledWith(expect.objectContaining({
      id: "b1",
      subtitle: "Novo subtítulo",
    })));
  });

  it("convida dono e alterna status", async () => {
    render(<AdminDashboard />);

    fireEvent.click(await screen.findByRole("button", { name: /Convidar dono/i }));
    fireEvent.change(screen.getByLabelText(/Email do responsável/i), { target: { value: "dono@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Enviar convite/i }));

    await waitFor(() => expect(api.inviteOwner).toHaveBeenCalledWith("b1", "dono@example.com"));

    fireEvent.click(await screen.findByRole("button", { name: /Desligar/i }));
    await waitFor(() => expect(api.toggleBusiness).toHaveBeenCalledWith("b1", false));
  });
});
