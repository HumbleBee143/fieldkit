// OAuth redirect target for TikTok's Content Posting API authorization flow.
// TikTok redirects here after Matthew authorizes the "Lost Pantheon Pipeline"
// sandbox app, with ?code=... in the query string.
//
// If TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET are set as Pages env vars
// (Cloudflare dashboard > Pages > lost-pantheon project > Settings > Environment
// variables), the code is exchanged server-side and the resulting access/refresh
// tokens are shown on screen once, for Matthew to copy into the pipeline's
// config. Without those vars set, it just shows the raw authorization code.
//
// This is a one-time manual bootstrap step, not a persistent service — no
// tokens are stored here.

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return new Response(
      `OAuth error: ${error}\n\n${url.searchParams.get("error_description") || ""}`,
      { status: 400, headers: { "content-type": "text/plain" } }
    );
  }

  if (!code) {
    return new Response("No authorization code received.", {
      status: 400,
      headers: { "content-type": "text/plain" },
    });
  }

  const clientKey = env.TIKTOK_CLIENT_KEY;
  const clientSecret = env.TIKTOK_CLIENT_SECRET;

  if (!clientKey || !clientSecret) {
    return new Response(
      `Authorization code received:\n\n${code}\n\n` +
        `TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET are not set as Pages env vars yet, ` +
        `so this wasn't exchanged for a token. Set them in the Cloudflare dashboard ` +
        `and re-run the authorization flow to get a token automatically.`,
      { status: 200, headers: { "content-type": "text/plain" } }
    );
  }

  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${url.origin}/oauth/lost-pantheon/callback`,
    }),
  });

  const tokenData = await tokenRes.json();

  return new Response(JSON.stringify(tokenData, null, 2), {
    status: tokenRes.ok ? 200 : 400,
    headers: { "content-type": "application/json" },
  });
}
