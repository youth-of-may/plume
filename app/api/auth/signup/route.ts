import { Resend } from 'resend';
import { createAdminClient } from '@/utils/supabase/admin';
import { render } from '@react-email/render';
import SignupConfirmationEmail from '@/emails/SignupConfirmationEmail';

const usernamePattern = /^[A-Za-z0-9_]+$/;

export async function POST(req: Request) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { email, password, name, username } = await req.json();

        if (!email || !password || !name || !username) {
            return Response.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        if (!usernamePattern.test(username)) {
            return Response.json({ error: 'Username can only contain letters, numbers, and underscores.' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Check username availability
        const { data: existingProfile } = await supabase
            .from('profile')
            .select('user_id')
            .ilike('username', username)
            .maybeSingle();

        if (existingProfile) {
            return Response.json({ error: 'username_taken' }, { status: 409 });
        }

        // Generate signup confirmation link (creates the unconfirmed user in Supabase)
        const { data, error } = await supabase.auth.admin.generateLink({
            type: 'signup',
            email,
            password,
            options: {
                data: { name, username },
                redirectTo: 'https://plume-lyart.vercel.app/confirm',
            },
        });

        if (error) {
            const msg = error.message.toLowerCase();
            if (msg.includes('already registered') || msg.includes('email')) {
                return Response.json({ error: 'email_taken' }, { status: 409 });
            }
            return Response.json({ error: error.message }, { status: 400 });
        }

        const confirmationUrl = data.properties.action_link;

        const html = await render(
            SignupConfirmationEmail({ userName: name, confirmationUrl })
        );

        const { error: emailError } = await resend.emails.send({
            from: 'Plume <plume@codedbymay.com>',
            to: [email],
            subject: 'Confirm your Plume account',
            html,
        });

        if (emailError) {
            return Response.json({ error: 'Failed to send confirmation email.' }, { status: 500 });
        }

        return Response.json({ ok: true });

    } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 });
    }
}
