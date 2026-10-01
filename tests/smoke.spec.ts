import { test, expect } from "@playwright/test";

test("homepage carrega e navega para catálogo real", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Seu negócio local com cara de marca grande/i })).toBeVisible();
  await page.getByRole("link", { name: /Abrir catálogo demo/i }).click();
  await expect(page).toHaveURL(/barbearia-do-ze/);
  await expect(page.getByText("Corte clássico")).toBeVisible();
});

test("catálogo real adiciona item ao carrinho", async ({ page }) => {
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

test("login real carrega", async ({ page }) => {
  await page.goto("/auth");
  await expect(page.getByRole("heading", { name: /Entre no seu painel/i })).toBeVisible();
  await expect(page.getByText(/Use o email vinculado à sua empresa/i)).toBeVisible();
});

test("painel exige autenticação", async ({ page }) => {
  await page.goto("/painel");
  await expect(page).toHaveURL(/auth/);
  await expect(page.getByRole("heading", { name: /Entre no seu painel/i })).toBeVisible();
});

test("admin exige autenticação", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/auth/);
  await expect(page.getByRole("heading", { name: /Entre no seu painel/i })).toBeVisible();
});

test("empresa inexistente não vaza catálogo", async ({ page }) => {
  await page.goto("/empresa-que-nao-existe");
  await expect(page.getByRole("heading", { name: /Catálogo temporariamente indisponível/i })).toBeVisible();
});
