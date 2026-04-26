import {
    Html, Head, Body, Container, Heading,
    Text, Button, Hr, Section
} from '@react-email/components';

interface SignupConfirmationEmailProps {
    userName: string;
    confirmationUrl: string;
}

export default function SignupConfirmationEmail({ userName, confirmationUrl }: SignupConfirmationEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#FBF5D1' }}>
                <Container style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
                    <Heading style={{ color: '#2E2805', marginBottom: 4 }}>
                        Welcome to Plume, {userName}!
                    </Heading>

                    <Section style={{
                        background: '#fff',
                        borderRadius: 8,
                        padding: 20,
                        marginBottom: 16,
                        borderTop: '4px solid #F0B6CF'
                    }}>
                        <Text style={{ color: '#374151', margin: 0 }}>
                            Thanks for signing up. Click the button below to confirm your email address
                            and activate your account.
                        </Text>
                    </Section>

                    <Hr />
                    <Button href={confirmationUrl} style={{
                        background: '#F0B6CF', color: '#2E2805',
                        padding: '12px 24px', borderRadius: 6, textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        Confirm Email Address
                    </Button>

                    <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 24 }}>
                        If you didn&apos;t create a Plume account, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
