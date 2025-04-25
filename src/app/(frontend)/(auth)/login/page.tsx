'use client'

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Link,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Center,
  Flex,
} from '@chakra-ui/react'
import { useState } from 'react'
import NextLink from 'next/link'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка авторизации')
      }

      toast({
        title: 'Вход выполнен',
        description: 'Вы успешно вошли в систему',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/')
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Произошла ошибка при входе',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container maxW="container.sm">
        <Center>
          <Box
            p={8}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="2xl"
            bg="white"
            w="full"
            maxW="md"
          >
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
              <Heading size="xl" textAlign="center" color="blue.600">
                Добро пожаловать
              </Heading>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введите ваш email"
                  size="lg"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Пароль</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите ваш пароль"
                    focusBorderColor="blue.500"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                colorScheme="blue"
                size="lg"
                width="full"
                type="submit"
                isLoading={isLoading}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Войти
              </Button>
              <Link
                as={NextLink}
                href="/forgot"
                color="blue.500"
                fontSize="sm"
                fontWeight="bold"
              >
                Забыли пароль?
              </Link>
            </VStack>
          </Box>
        </Center>
      </Container>
    </Flex>
  )
}
