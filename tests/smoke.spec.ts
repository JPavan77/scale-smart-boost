import { test, expect } from "@playwright/test";

test("homepage carrega e navega para a demo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Seu negócio local com cara de marca grande/i })).toBeVisible();
  await page.getByRole("link", { name: /Abrir catálogo demo/i }).click();
  await expect(page).toHaveURL(/barbearia-do-ze/);
  await expect(page.getByText("Corte clássico")).toBeVisible();
});

test("catálogo adiciona item e atualiza carrinho desktop", async ({ page }) => {
  await page.goto("/barbearia-do-ze");
  const product = page.locator(".product").filter({ hasText: "Corte clássico" });
  await expect(product).toBeVisible();
  await product.getByRole("button", { name: /Adicionar Corte clássico/i }).click();

  const cart = page.locator("aside.cart").first();
  await expect(cart.getByRole("heading", { name: /Seu pedido/i })).toBeVisible();
  await expect(cart.getByText("Corte clássico")).toBeVisible();
  await expect(cart.getByText("R$ 45,00")).toBeVisible();
  await expect(cart.getByRole("button", { name: /Enviar pelo WhatsApp/i })).toBeEnabled();
});

test("carrinho persiste por empresa", async ({ page }) => {
  await page.goto("/barbearia-do-ze");
  const product = page.locator(".product").filter({ hasText: "Barba completa" });
  await product.getByRole("button", { name: /Adicionar Barba completa/i }).click();
  await page.reload();

  const cart = page.locator("aside.cart").first();
  await expect(cart.getByText("Barba completa")).toBeVisible();
});

test("login demo permite acessar painel", async ({ page }) => {
  await page.goto("/auth");
  await expect(page.getByRole("heading", { name: /Entre no seu painel/i })).toBeVisible();
  await page.getByRole("button", { name: /^Entrar$/i }).click();
  await expect(page).toHaveURL(/painel/);
  await expect(page.getByRole("heading", { name: /Seu catálogo/i })).toBeVisible();
});

test("painel do dono exibe dados e abre cadastro de item", async ({ page }) => {
  await page.goto("/painel");
  await expect(page.getByRole("heading", { name: /Seu catálogo/i })).toBeVisible();
  await expect(page.getByText("Corte clássico")).toBeVisible();
  await page.getByRole("button", { name: /Novo item/i }).click();
  await expect(page.getByText("Item do catálogo")).toBeVisible();
  await expect(page.getByLabel("Nome")).toBeVisible();
});

test("admin abre e permite iniciar cadastro de empresa", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /^Empresas$/i })).toBeVisible();
  await expect(page.getByText("Barbearia do Zé")).toBeVisible();
  await page.getByRole("button", { name: /Criar empresa/i }).click();
  await expect(page.getByText(/Cadastro da empresa/i)).toBeVisible();
  await expect(page.getByLabel("Nome")).toBeVisible();
  await expect(page.getByLabel(/Link/)).toBeVisible();
});

test("rota inexistente mostra catálogo indisponível", async ({ page }) => {
  await page.goto("/empresa-que-nao-existe");
  await expect(page.getByRole("heading", { name: /Catálogo temporariamente indisponível/i })).toBeVisible();
});
