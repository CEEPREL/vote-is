export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

export async function GET() {
  return new Response(JSON.stringify({ message: 'CORS is disabled!' }), {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
