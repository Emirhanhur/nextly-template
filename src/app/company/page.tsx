import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { Container } from "@/components/Container";

export default function CompanyPage() {
  return (
    <AnimatedPageWrapper>
      <Container className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-800 dark:text-white text-center w-full">Company Page</h1>
      </Container>
    </AnimatedPageWrapper>
  );
} 