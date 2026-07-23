import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);

    const supabase = createClient() as any;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const metadata = session.metadata || {};

        if (metadata.type === "ad_free_subscription" && userId) {
          // Upgrade profile to ad-free
          await supabase
            .from("profiles")
            .update({ is_ad_free: true, updated_at: new Date().toISOString() })
            .eq("id", userId);
        } else if (metadata.type === "mentorship_booking" && metadata.sessionId) {
          // Confirm mentorship session payment
          await supabase
            .from("mentorship_sessions")
            .update({
              status: "confirmed",
              stripe_payment_intent_id: session.payment_intent,
              updated_at: new Date().toISOString(),
            })
            .eq("id", metadata.sessionId);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        if (paymentIntent.metadata?.job_post_id) {
          // Activate paid job listing
          await supabase
            .from("jobs")
            .update({ status: "active", updated_at: new Date().toISOString() })
            .eq("id", paymentIntent.metadata.job_post_id);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Handler Error: ${err.message}` },
      { status: 400 }
    );
  }
}
