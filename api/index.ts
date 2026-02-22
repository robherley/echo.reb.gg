export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    const echo: Record<string, unknown> = {
      method: request.method,
      url: request.url,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams),
      headers: Object.fromEntries(
        [...request.headers].filter(([k]) => !k.toLowerCase().startsWith("x-vercel-")),
      ),
    };

    const body = await request.text();
    if (body) {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          echo.body = JSON.parse(body);
        } catch {
          echo.body = body;
        }
      } else {
        echo.body = body;
      }
    }

    return new Response(JSON.stringify(echo, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
