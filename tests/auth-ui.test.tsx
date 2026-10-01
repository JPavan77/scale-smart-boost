import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthPage } from "../src/pages/AuthPage";

const signIn = vi.fn();
const navigate = vi.fn();

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({ signIn }),
}));

vi.mock("../src/lib/api", () => ({
  cloudConfigured: true,
}));

vi.mock("../src/lib/navigation", () => ({
  appHref: (path: string) => path,
  navigate: (...args: any[]) => navigate(...args),
}));

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signIn.mockResolvedValue(undefined);
  });

  it("envia email/senha e navega para o painel", async () => {
    render(<AuthPage />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "senha-teste" } });
    fireEvent.click(screen.getByRole("button", { name: /^Entrar$/i }));

    await waitFor(() => expect(signIn).toHaveBeenCalledWith("admin@example.com", "senha-teste"));
    expect(navigate).toHaveBeenCalledWith("/painel");
  });

  it("mostra erro de autenticação", async () => {
    signIn.mockRejectedValueOnce(new Error("Credenciais inválidas"));
    render(<AuthPage />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "errada" } });
    fireEvent.click(screen.getByRole("button", { name: /^Entrar$/i }));

    expect(await screen.findByText("Credenciais inválidas")).toBeVisible();
    expect(navigate).not.toHaveBeenCalled();
  });
});
