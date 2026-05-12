import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    const SECRET_KEY = "Kiddo-Stealth-Key-2026";
    
    // Decrypt from Client
    const _d = (encoded: string) => {
        const t = decodeURIComponent(escape(atob(encoded)));
        let r = "";
        for (let i = 0; i < t.length; i++) {
            r += String.fromCharCode(t.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
        }
        return JSON.parse(r);
    };

    // Encrypt to Client
    const _e = (t: string) => {
        let r = "";
        for (let i = 0; i < t.length; i++) {
            r += String.fromCharCode(t.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
        }
        return btoa(unescape(encodeURIComponent(r)));
    };

    try {
        const rawBody = await request.json();
        if (!rawBody.d) throw new Error('Missing payload');
        
        const body = _d(rawBody.d);
        const targetUrl = 'https://ezweystock.petrix.id/gpt/payment/';
        
        const payload = {
            plan: body.plan,
            payment: body.payment,
            currency: body.currency,
            session: body.session
        };

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': request.headers.get('user-agent') || 'Astro-SSR-Agent'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        // Encrypt the response back to client
        const encryptedResponse = _e(JSON.stringify(data));

        return new Response(JSON.stringify({ r: encryptedResponse }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        // Even errors can be encrypted if desired, but let's keep basic success:false for now
        return new Response(JSON.stringify({
            success: false,
            error: 'Server internal error'
        }), { status: 500 });
    }
};
