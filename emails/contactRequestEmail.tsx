import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ContactRequestEmailProps {
  userEmail: string;
  requestDate: string;
  contactRequestText: string;
}

const ContactRequestEmail = ({
  userEmail,
  requestDate,
  contactRequestText,
}: ContactRequestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Veevo Contact Request</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-[40px] bg-white p-[20px] rounded-[8px] shadow-sm">
            <Heading className="text-[24px] font-bold text-gray-800 my-[16px]">
              New Contact Request for Veevo
            </Heading>
            <Text className="text-[16px] text-gray-700 mb-[24px]">
              A user has submitted a new contact request for your Veevo app. Here are the details:
            </Text>
            
            <Section className="bg-gray-50 p-[16px] rounded-[8px] mb-[24px]">
              <Text className="text-[14px] text-gray-600 mb-[8px]">
                <strong>From:</strong> {userEmail}
              </Text>
              <Text className="text-[14px] text-gray-600 mb-[8px]">
                <strong>Date:</strong> {requestDate}
              </Text>
              <Hr className="border-gray-300 my-[16px]" />
              <Text className="text-[14px] text-gray-600 mb-[8px]">
                <strong>Contact Request:</strong>
              </Text>
              <Text className="text-[14px] text-gray-700">
                {contactRequestText}
              </Text>
            </Section>
            
            <Text className="text-[14px] text-gray-700">
              You can respond directly to the user by replying to this email.
            </Text>
            
            <Hr className="border-gray-300 my-[24px]" />
            
            <Text className="text-[12px] text-gray-500 m-0">
              © 2025 Veevo. All rights reserved.
            </Text>
            <Text className="text-[12px] text-gray-500 m-0">
              Delft, Netherlands
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default ContactRequestEmail;