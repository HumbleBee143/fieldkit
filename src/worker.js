// fieldkit Worker entry point.
//
// This project was previously deployed as a pure static-assets Worker
// (no server-side code at all), which is why the OAuth callback route
// below returned 404 — there was nowhere for it to run. This script adds
// a real fetch handler: it intercepts the one dynamic route it needs to
// and falls through to the static assets binding (env.ASSETS) for
// everything else, so all the existing field-kit.co.uk tool pages keep
// working exactly as before.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/oauth/lost-pantheon/callback") {
      return handleLostPantheonCallback(request, env, url);
    }

    return env.ASSETS.fetch(request);
  },
};

// OAuth redirect target for TikTok's Content Posting API authorization
// flow (Lost Pantheon Pipeline sandbox app). TikTok redirects here after
// Matthew authorizes the app, with ?code=... in the query string.
//
// If TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET are set as Worker secrets,
// the code is exchanged server-side and the resulting tokens are shown
// on screen once, for Matthew to copy into the pipeline's config.
// Without those set, it just shows the raw authorization code.
//
// This is a one-time manual bootstrap step, not a persistent service —
// no tokens are stored here.
async function handleLostPantheonCallback(request, env, url) {
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
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }

  const clientKey = env.TIKTOK_CLIENT_KEY;
  const clientSecret = env.TIKTOK_CLIENT_SECRET;

  if (!clientKey || !clientSecret) {
    return new Response(
      `Authorization code received:\n\n${code}\n\n` +
        `TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET are not set as Worker secrets yet, ` +
        `so this wasn't exchanged for a token.`,
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
