import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-bootstrap-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const expectedSecret = Deno.env.get("BOOTSTRAP_ADMIN_SECRET");
    const receivedSecret = req.headers.get("x-bootstrap-secret");
    if (!expectedSecret || !receivedSecret || receivedSecret !== expectedSecret) {
      return json({ error: "Bootstrap não autorizado." }, 403);
    }

    const url = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceRoleKey) return json({ error: "Ambiente Supabase incompleto." }, 500);

    const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

    const { count, error: countError } = await admin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "super_admin");
    if (countError) throw countError;
    if ((count ?? 0) > 0) return json({ error: "Já existe um super admin. Bootstrap encerrado." }, 409);

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    if (!email) return json({ error: "Email obrigatório." }, 400);

    let userId: string | null = null;
    const invite = await admin.auth.admin.inviteUserByEmail(email, { data: { initial_super_admin: true } });

    if (!invite.error && invite.data.user) {
      userId = invite.data.user.id;
    } else {
      const { data: users, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (usersError) throw usersError;
      userId = users.users.find((user) => user.email?.toLowerCase() === email)?.id ?? null;
      if (!userId) throw invite.error ?? new Error("Usuário não encontrado.");
    }

    const { error: roleError } = await admin
      .from("user_roles")
      .insert({ user_id: userId, role: "super_admin" });
    if (roleError) throw roleError;

    return json({ ok: true, userId });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "Erro inesperado." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
