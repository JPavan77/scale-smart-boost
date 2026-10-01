import { test, expect } from "@playwright/test";

test("homepage carrega e navega para a demo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Seu negócio local com cara de marca grande/i })).toBeVisible();
  await page.getByRole("link", { name: /Abrir catálogo demo/i }).click();
  await expect(page).toHaveURL(/barbearia-do-ze/);
  await expect(page.getByRole("heading", { name: /Cortes, barba e cuidado sem enrolação|Escolha/i })).toBeVisible();
});

test("catálogo adiciona item e monta carrinho", async ({ page }) => {
  await page.goto("/barbearia-do-ze");
  await expect(page.getByText("Corte clássico")).toBeVisible();

  const addButtons = page.getByRole("button", { name: /Adicionar/i });
  await addButtons.first().click();

  await expect(page.getByText(/1 item/i)).toBeVisible();
  await page.getByRole("button", { name: /Ver pedido/i }).click();
  await expect(page.getByRole("heading", { name: /Seu pedido/i })).toBeVisible();
  await expect(page.getByText("Corte clássico")).toBeVisible();
});

test("login demo permite acessar painel", async ({ page }) => {
  await page.goto("/auth");
  await expect(page.getByRole("heading", { name: /Entre no seu painel/i })).toBeVisible();
  await page.getByRole("button", { name: /^Entrar$/i }).click();
  await expect(page).toHaveURL(/painel/);
  await expect(page.getByRole("heading", { name: /Seu catálogo/i })).toBeVisible();
});

test("painel do dono exibe dados e itens", async ({ page }) => {
  await page.goto("/painel");
  await expect(page.getByRole("heading", { name: /Seu catálogo/i })).toBeVisible();
  await expect(page.getByText("Corte clássico")).toBeVisible();
  await expect(page.getByRole("button", { name: /Novo item/i })).toBeVisible();
});

test("admin abre e permite abrir cadastro de empresa", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /^Empresas$/i })).toBeVisible();
  await expect(page.getByText("Barbearia do Zé")).toBeVisible();
  await page.getByRole("button", { name: /Criar empresa/i }).click();
  await expect(page.getByText(/Cadastro da empresa/i)).toBeVisible();
});

test("rota inexistente cai no catálogo indisponível", async ({ page }) => {
  await page.goto("/empresa-que-nao-existe");
  await expect(page.getByRole("heading", { name: /Catálogo temporariamente indisponível/i })).toBeVisible();
});
