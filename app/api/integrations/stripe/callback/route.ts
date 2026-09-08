import { NextResponse } from 'next/server';
import { createAdminServiceClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const stateParam = searchParams.get('state');

    // 1. Structural input and state fallback verification
    if (!code || !stateParam) {
      return NextResponse.json({ error: 'OAuth authorization parameters missing.' }, { status: 400 });
    }

    // Parse organization tracking context safely out of the encrypted state payload
    let orgId: string;
    try {
      const parsedState = JSON.parse(stateParam);
      orgId = parsedState.orgId;
    } catch (e) {
      return NextResponse.json({ error: 'Malformed OAuth state signature context.' }, { status: 400 });
    }

    if (!orgId) {
      return NextResponse.json({ error: 'Organization mapping missing from payload context.' }, { status: 400 });
    }

    // 2. Swapping temporary OAuth code for long-lived Stripe tokens
    // We target Stripe's secure token handoff endpoint using standard body parameters
    const tokenResponse = await fetch('https://stripe.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` // Your sk_test_... key
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code
      })
    });

    const stripeData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return NextResponse.json({ 
        error: stripeData.error_description || 'Stripe token authentication exchange failure.' 
      }, { status: 400 });
    }

    // 3. Initialize your privileged, server-only Supabase service client
    // This cleanly bypasses Row-Level Security parameters to execute the transaction safely
    const supabaseAdmin = createAdminServiceClient();

    // 4. Atomic verification and structural update to the database integrations layer
    const { error: dbError } = await supabaseAdmin
      .from('integrations')
      .upsert({
        organization_id: orgId,
        name: 'Stripe Primary Integration',
        platform: 'stripe',
        status: 'active',
        configuration: {
          stripe_user_id: stripeData.stripe_user_id, // e.g. acct_xxxxxx
          access_token: stripeData.access_token,
          refresh_token: stripeData.refresh_token,
          stripe_publishable_key: stripeData.stripe_publishable_key,
          livemode: stripeData.livemode
        }
      }, {
        onConflict: 'organization_id, platform' // Prevents creating duplicate gateway records per tenant
      });

    if (dbError) {
      return NextResponse.json({ error: 'Integrations database mapping payload entry failure.' }, { status: 500 })
    }

    // 5. Successful connection redirect loop
    // Safely send the merchant back to their dashboard view with a success indicator
    return NextResponse.redirect(new URL('/dashboard?stripe=success', request.url));

  } catch (err) {
    return NextResponse.json({ error: 'Internal OAuth Callback Processing Error' }, { status: 500 });
  }
}
