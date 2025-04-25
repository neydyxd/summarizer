'use client'

import { useState, useMemo } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Link,

} from '@chakra-ui/react'
import { isValidEmail } from '@/app/utils'

export default function ForgotForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const isEmailValid = useMemo(() => isValidEmail(email), [email])
  const isEmailInvalid = email.length > 0 && !isEmailValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      })

      if (res.ok) {
        toast({
          title: 'Email отправлен',
          description: 'Проверьте почту для инструкций по сбросу пароля',
          status: 'success',
          duration: 5000,
        })
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось отправить email для сброса пароля',
          status: 'error',
          duration: 5000,
        })
      }
    } catch (error: unknown) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6}>
        <FormControl isRequired isInvalid={isEmailInvalid}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            isInvalid={isEmailInvalid}
            size="lg"
            focusBorderColor="blue.500"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={loading}
          isDisabled={!isEmailValid}
          width="full"
          size="lg"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Отправить ссылку для сброса пароля
        </Button>

        <Link
          href="/login"
          color="blue.500"
          fontSize="sm"
          fontWeight="bold"
          _hover={{ textDecoration: 'none', color: 'blue.600' }}
        >
          Назад к входу
        </Link>
      </VStack>
    </form>
  )
}
