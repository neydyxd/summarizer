import { useState, useMemo } from 'react'
import {
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Box,
  Text,
  Center,
  Container,
  useColorModeValue,
} from '@chakra-ui/react'
import { isValidEmail } from '@/app/utils'

export default function InvitationsTab() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const isEmailValid = useMemo(() => isValidEmail(email), [email])
  const isEmailInvalid = email.length > 0 && !isEmailValid

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmailValid) return

    setLoading(true)
    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast({
          title: 'Приглашение отправлено',
          description: 'Пользователь получит письмо с инструкциями по входу',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setEmail('')
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Ошибка при отправке приглашения')
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <TabPanel>
      <Center h="100%">
        <Container maxW="xl">
          <Box
            p={8}
            bg={bgColor}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Text fontSize="xl" fontWeight="medium" mb={6} textAlign="center">
              Пригласите нового пользователя
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={isEmailInvalid}>
                  <FormLabel>Email пользователя</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    isDisabled={loading}
                    size="lg"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  isDisabled={!isEmailValid || loading}
                  w="full"
                  size="lg"
                >
                  Отправить приглашение
                </Button>
              </VStack>
            </form>
          </Box>
        </Container>
      </Center>
    </TabPanel>
  )
}
