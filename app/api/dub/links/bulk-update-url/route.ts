import { NextRequest, NextResponse } from 'next/server';
import { dubTagMap } from '@/lib/utils';
export async function POST(request: NextRequest) {
    try {
        const { tenantId, domain } = await request.json();

        const tagId = dubTagMap.find((tag) => tag.name === "videopage")?.id ?? "";
        
        // Retrieve the list of links based on tenantId and tagId
        const linksResponse = await fetch(`https://api.dub.co/links?tenantId=${tenantId}&tagId=${tagId}`, {
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

        console.log(links);

        // Prepare the bulk update payload
        const updatePayload = links.map((link: any) => ({
            ...link,
            url: `https://${domain}/${link.url.split('/').slice(3).join('/')}`
        }));

        console.log(updatePayload);

        // Bulk update the links
        const updateResponse = await fetch('https://api.dub.co/links/bulk-update', {
            method: 'PATCH',
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
