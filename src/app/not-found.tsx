'use client'

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const MotionBox = motion(Box)

export default function NotFound() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, blue.50, indigo.100)"
    >
      <Container maxW="container.md" textAlign="center">
        <VStack spacing={8}>
          <MotionBox initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <Heading as="h1" fontSize="9xl" fontWeight="bold" color="indigo.600">
              404
            </Heading>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <VStack spacing={4}>
              <Heading as="h2" fontSize="3xl" fontWeight="semibold" color="gray.800">
                Упс! Страница не найдена
              </Heading>

              <Text color="gray.600">Извините, но страница, которую вы ищете, не существует.</Text>
              <Link href="/">
                <Button size="lg" px={6} py={3} _hover={{ bg: 'indigo.700' }} transition="all 0.3s">
                  Вернуться на главную
                </Button>
              </Link>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  )
}
