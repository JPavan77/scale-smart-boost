import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../src/components/DashboardShell", () => ({
  DashboardShell: ({ action, children }: any) => <div>{action}{children}</div>,
}));

vi.mock("../src/lib/api", () => ({
  getBusinesses: vi.fn(async () => [{
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
  }]),
  inviteOwner: vi.fn(),
  saveBusiness: vi.fn(),
  toggleBusiness: vi.fn(),
  uploadCatalogImage: vi.fn(),
}));

import { AdminDashboard } from "../src/pages/AdminDashboard";

describe("AdminDashboard", () => {
  it("abre o formulário ao clicar em Criar empresa", async () => {
    render(<AdminDashboard />);
    const button = await screen.findByRole("button", { name: /Criar empresa/i });
    fireEvent.click(button);
    expect(screen.getByText(/Cadastro da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText(/Link/)).toBeInTheDocument();
  });

  it("abre edição ao clicar em Editar", async () => {
    render(<AdminDashboard />);
    const edit = await screen.findByRole("button", { name: /Editar/i });
    fireEvent.click(edit);
    expect(screen.getByText(/Editar empresa/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Barbearia do Zé")).toBeInTheDocument();
  });
});
