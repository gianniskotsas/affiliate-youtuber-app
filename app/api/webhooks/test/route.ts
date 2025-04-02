import { headers } from 'next/headers';

export async function POST(req: Request) {
  const headersList = headers();
  const url = new URL(req.url);
  
  console.log('Request received:', {
    pathname: url.pathname,
    headers: Object.fromEntries(headersList.entries()),
    method: req.method
  });

  return Response.json({ 
    message: 'The route is working',
    debug: {
      pathname: url.pathname,
      headers: Object.fromEntries(headersList.entries())
    }
  });
}