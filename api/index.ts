export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    const echo: Record<string, unknown> = {
      method: request.method,
      url: request.url,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams),
      headers: Object.fromEntries(
        [...request.headers].filter(([k]) => {
          const header = k.toLowerCase();
          return (
            !header.startsWith("x-vercel-") ||
            header === "x-vercel-id" ||
            header.startsWith("x-vercel-ip-") ||
            header === "x-vercel-owner-id"
          );
        }),
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

    const headers = new Headers({
      "Content-Type": "application/json",
      // @ts-ignore
      "x-vercel-deployment-id": process.env.VERCEL_DEPLOYMENT_ID || "",
      // @ts-ignore
      "x-vercel-project-id": process.env.VERCEL_PROJECT_ID || "",
    });

    return new Response(JSON.stringify(echo, null, 2), { headers });
  },
};
