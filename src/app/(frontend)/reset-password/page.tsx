'use client'
import { useEffect, useState, Suspense } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
  Spinner,
  Center,
  Container,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const token = searchParams.get('token')
  const toast = useToast()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password === confirmPassword) {
      try {
        const response = await fetch('api/users/reset-password', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
            password: password,
          }),
        })

        if (response.ok) {
          toast({
            title: 'Пароль успешно изменён',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          router.push('/login')
        } else {
          toast({
            title: 'Ошибка при изменении пароля',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      } catch (error: any) {
        toast({
          title: 'Ошибка сети',
          description: error.message || 'Неизвестная ошибка',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } else {
      toast({
        title: 'Пароли не совпадают',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Center minH="100vh" py={10}>
      <Container maxW="container.sm">
        <Box
          maxW="md"
          mx="auto"
          p={8}
          borderWidth={1}
          borderRadius="xl"
          boxShadow="xl"
          bg={bgColor}
          borderColor={borderColor}
          transition="all 0.3s"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '2xl',
          }}
        >
          <VStack spacing={6} align="stretch">
            <Heading
              as="h1"
              size="xl"
              textAlign="center"
              bgGradient="linear(to-r, teal.400, blue.500)"
              bgClip="text"
              fontWeight="extrabold"
            >
              Сброс пароля
            </Heading>
            <Text textAlign="center" color="gray.500">
              Введите новый пароль для вашего аккаунта
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl id="new-password" isRequired>
                  <FormLabel>Новый пароль</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="lg"
                    focusBorderColor="teal.400"
                  />
                </FormControl>
                <FormControl id="confirm-password" isRequired>
                  <FormLabel>Подтвердите пароль</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    size="lg"
                    focusBorderColor="teal.400"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  width="full"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                >
                  Сбросить пароль
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Container>
    </Center>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" color="teal.500" />
        </Center>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
