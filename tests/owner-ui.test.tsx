import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OwnerDashboard } from "../src/pages/OwnerDashboard";
import * as api from "../src/lib/api";

vi.mock("../src/components/DashboardShell", () => ({
  DashboardShell: ({ action, children }: any) => <div>{action}{children}</div>,
}));

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    isSuperAdmin: true,
    businessIds: [],
  }),
}));

vi.mock("../src/lib/api", () => ({
  cloudConfigured: true,
  getBusinesses: vi.fn(),
  getOwnedBusiness: vi.fn(),
  getCatalogAdminData: vi.fn(),
  saveBusiness: vi.fn(),
  saveCategory: vi.fn(),
  deleteCategory: vi.fn(),
  saveItem: vi.fn(),
  deleteItem: vi.fn(),
  uploadCatalogImage: vi.fn(),
}));

const businessA = {
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

const businessB = { ...businessA, id: "b2", slug: "cafe-do-centro", name: "Café do Centro" };

const category = {
  id: "c1",
  business_id: "b1",
  name: "Cortes",
  sort_order: 1,
};

const item = {
  id: "i1",
  business_id: "b1",
  category_id: "c1",
  name: "Corte clássico",
  description: "Corte",
  price: 45,
  duration_minutes: 45,
  image_url: null,
  is_active: true,
  sort_order: 1,
  category,
  variants: [],
};

describe("OwnerDashboard como super admin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(api.getBusinesses).mockResolvedValue([businessA, businessB] as any);
    vi.mocked(api.getCatalogAdminData).mockImplementation(async (id: string) => ({
      categories: id === "b1" ? [category] as any : [],
      items: id === "b1" ? [item] as any : [],
    }));
    vi.mocked(api.saveBusiness).mockResolvedValue(businessA as any);
    vi.mocked(api.saveCategory).mockResolvedValue(undefined);
    vi.mocked(api.saveItem).mockResolvedValue(undefined);
    vi.mocked(api.deleteCategory).mockResolvedValue(undefined);
    vi.mocked(api.deleteItem).mockResolvedValue(undefined);
  });

  it("permite escolher qual empresa gerenciar", async () => {
    render(<OwnerDashboard />);
    const selector = await screen.findByLabelText(/Empresa gerenciada/i);
    expect((selector as HTMLSelectElement).value).toBe("b1");

    fireEvent.change(selector, { target: { value: "b2" } });
    await waitFor(() => expect(api.getCatalogAdminData).toHaveBeenCalledWith("b2"));
  });

  it("cria categoria", async () => {
    render(<OwnerDashboard />);
    await screen.findByText(/Gerenciando: Barbearia do Zé/i);

    fireEvent.change(screen.getByPlaceholderText(/Nova categoria/i), { target: { value: "Pacotes QA" } });
    fireEvent.click(screen.getByRole("button", { name: /Adicionar/i }));

    await waitFor(() => expect(api.saveCategory).toHaveBeenCalledWith(expect.objectContaining({
      business_id: "b1",
      name: "Pacotes QA",
    })));
  });

  it("abre e salva item com variações", async () => {
    render(<OwnerDashboard />);
    await screen.findByText(/Corte clássico/i);

    fireEvent.click(screen.getByRole("button", { name: /Novo item/i }));
    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Combo QA" } });
    fireEvent.change(screen.getByLabelText("Preço"), { target: { value: "79,90" } });
    fireEvent.change(screen.getByLabelText(/Duração/i), { target: { value: "60" } });
    fireEvent.change(screen.getByLabelText(/Variações/i), { target: { value: "Padrão\nPremium=99,90" } });
    fireEvent.click(screen.getByRole("button", { name: /Salvar item/i }));

    await waitFor(() => expect(api.saveItem).toHaveBeenCalledTimes(1));
    expect(api.saveItem).toHaveBeenCalledWith(
      expect.objectContaining({
        business_id: "b1",
        name: "Combo QA",
        price: 79.9,
        duration_minutes: 60,
      }),
      [
        { name: "Padrão", price: null },
        { name: "Premium", price: 99.9 },
      ],
    );
  });

  it("salva dados operacionais da empresa", async () => {
    render(<OwnerDashboard />);
    await screen.findByDisplayValue("5511999999999");

    fireEvent.change(screen.getByLabelText("WhatsApp"), { target: { value: "5511888888888" } });
    fireEvent.click(screen.getByRole("button", { name: /Salvar empresa/i }));

    await waitFor(() => expect(api.saveBusiness).toHaveBeenCalledWith(expect.objectContaining({
      id: "b1",
      whatsapp: "5511888888888",
    })));
  });
});
