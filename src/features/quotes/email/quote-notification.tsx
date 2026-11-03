import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";

type QuoteNotificationEmailProps = {
  quoteId: string;
  productTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: Date;
  adminUrl: string;
};

export function QuoteNotificationEmail({
  quoteId: _quoteId,
  productTitle,
  name,
  email,
  phone,
  message,
  submittedAt,
  adminUrl,
}: QuoteNotificationEmailProps) {
  const previewText = `New quote request received for ${productTitle} from ${name}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>New Quote Request</Heading>
          <Text style={introStyle}>
            A new quote enquiry has been submitted through the vinset Pharma
            website.
          </Text>

          <Section style={cardStyle}>
            <Text style={itemLabelStyle}>Product</Text>
            <Text style={itemValueStyle}>{productTitle}</Text>

            <Hr style={dividerStyle} />

            <Text style={itemLabelStyle}>Contact Name</Text>
            <Text style={itemValueStyle}>{name}</Text>

            <Hr style={dividerStyle} />

            <Text style={itemLabelStyle}>Email Address</Text>
            <Text style={itemValueStyle}>
              <Link href={`mailto:${email}`} style={linkStyle}>
                {email}
              </Link>
            </Text>

            <Hr style={dividerStyle} />

            <Text style={itemLabelStyle}>Phone Number</Text>
            <Text style={itemValueStyle}>
              <Link href={`tel:${phone.replace(/\s+/g, "")}`} style={linkStyle}>
                {phone}
              </Link>
            </Text>

            <Hr style={dividerStyle} />

            <Text style={itemLabelStyle}>Submitted At</Text>
            <Text style={itemValueStyle}>
              {submittedAt.toUTCString()} ({submittedAt.toISOString()})
            </Text>

            <Hr style={dividerStyle} />

            <Text style={itemLabelStyle}>Message</Text>
            <Text style={messageStyle}>{message}</Text>
          </Section>

          <Section style={actionSectionStyle}>
            <Link href={adminUrl} style={buttonStyle}>
              View Quote in Admin Dashboard &rarr;
            </Link>
          </Section>

          <Hr style={dividerStyle} />

          <Text style={footerStyle}>
            vinset Pharma automated internal notification. Reply directly to
            this email to contact the prospective client.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const mainStyle: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "40px 0",
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "580px",
  padding: "36px",
};

const headingStyle: React.CSSProperties = {
  color: "#1a1f36",
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 12px",
};

const introStyle: React.CSSProperties = {
  color: "#4f566b",
  fontSize: "15px",
  lineHeight: "1.5",
  margin: "0 0 24px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "20px",
  margin: "0 0 28px",
};

const itemLabelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.05em",
  margin: "0 0 4px",
  textTransform: "uppercase",
};

const itemValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "15px",
  fontWeight: "500",
  margin: "0",
};

const messageStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-line",
};

const dividerStyle: React.CSSProperties = {
  borderColor: "#e2e8f0",
  borderWidth: "1px 0 0",
  margin: "14px 0",
};

const linkStyle: React.CSSProperties = {
  color: "#0284c7",
  textDecoration: "underline",
};

const actionSectionStyle: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#0284c7",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
};

const footerStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "20px 0 0",
  textAlign: "center" as const,
};
