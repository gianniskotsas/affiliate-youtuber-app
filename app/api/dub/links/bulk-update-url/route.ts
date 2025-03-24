import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { tenantId, username } = await request.json();

        // Retrieve the list of links based on tenantId
        const linksResponse = await fetch(`https://api.dub.co/links?tenantId=${tenantId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DUB_API_KEY}`
            }
        });

        if (!linksResponse.ok) {
            return NextResponse.json({ error: 'Failed to retrieve links' }, { status: linksResponse.status });
        }

        const links = await linksResponse.json();

        // Prepare the bulk update payload
        const updatePayload = links.map((link: any) => ({
            id: link.id,
            url: `https://veevo.app/${username}`
        }));

        // Bulk update the links
        const updateResponse = await fetch('https://api.dub.co/links/bulk-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DUB_API_KEY}`
            },
            body: JSON.stringify({ data: updatePayload })
        });

        if (!updateResponse.ok) {
            return NextResponse.json({ error: 'Failed to update links' }, { status: updateResponse.status });
        }

        const updateResult = await updateResponse.json();

        return NextResponse.json(updateResult, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
