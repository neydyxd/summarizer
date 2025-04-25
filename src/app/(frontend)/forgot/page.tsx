import { Container, Heading, Box, Center, Flex } from '@chakra-ui/react'
import ForgotForm from './ForgotForm'

export default async function ForgotPage() {
  return (
    <Container maxW="container.sm" py={10}>
      <Flex minH="calc(100vh - 80px)" align="center" justify="center">
        <Center w="full">
          <Box
            p={8}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="2xl"
            bg="white"
            w="full"
            maxW="md"
          >
            <Heading mb={8} textAlign="center" size="xl" color="blue.600">
              Сброс пароля
            </Heading>
            <ForgotForm />
          </Box>
        </Center>
      </Flex>
    </Container>
  )
}
