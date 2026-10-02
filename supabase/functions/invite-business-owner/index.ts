import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Não autenticado." }, 401);

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceRoleKey) return json({ error: "Ambiente Supabase incompleto." }, 500);

    const callerClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: userData, error: userError } = await callerClient.auth.getUser();
    if (userError || !userData.user) return json({ error: "Sessão inválida." }, 401);

    const { data: allowed, error: roleError } = await callerClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "super_admin",
    });
    if (roleError || !allowed) return json({ error: "Apenas super admins podem convidar responsáveis." }, 403);

    const body = await req.json();
    const businessId = String(body.businessId || "");
    const email = String(body.email || "").trim().toLowerCase();
    if (!businessId || !email) return json({ error: "businessId e email são obrigatórios." }, 400);

    // O cliente admin só é carregado depois da verificação de papel.
    const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

    const { data: business, error: businessError } = await admin
      .from("businesses")
      .select("id,name")
      .eq("id", businessId)
      .maybeSingle();
    if (businessError || !business) return json({ error: "Empresa não encontrada." }, 404);

    let targetUserId: string | null = null;
    const inviteResult = await admin.auth.admin.inviteUserByEmail(email, {
      data: { business_id: businessId, business_name: business.name },
      redirectTo: "https://jpavan77.github.io/scale-smart-boost/?invite=1",
    });

    if (!inviteResult.error && inviteResult.data.user) {
      targetUserId = inviteResult.data.user.id;
    } else {
      const { data: usersPage, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (listError) throw listError;
      const existing = usersPage.users.find((u) => u.email?.toLowerCase() === email);
      if (!existing) throw inviteResult.error ?? new Error("Não foi possível criar ou localizar o usuário.");
      targetUserId = existing.id;
    }

    const { error: memberError } = await admin
      .from("business_members")
      .upsert({ user_id: targetUserId, business_id: businessId }, { onConflict: "user_id,business_id" });
    if (memberError) throw memberError;

    return json({
      ok: true,
      userId: targetUserId,
      businessId,
      invited: !inviteResult.error,
      existingUser: Boolean(inviteResult.error),
    });
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
