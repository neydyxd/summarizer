'use client'

import { Tabs, TabList, TabPanels, Tab, Box, Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import SummarizerTab from './components/SummarizerTab'
import InvitationsTab from './components/InvitationsTab'

interface UserData {
  user: {
    isManager: boolean
    email: string
  }
  // другие поля пользователя, если они есть
}

export default function HomePage() {
  const [isManager, setIsManager] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me')
        if (!response.ok) {
          throw new Error('Ошибка при получении данных пользователя')
        }
        const data: UserData = await response.json()
        setIsManager(data.user.isManager)
        setUserEmail(data.user.email)
      } catch (error) {
        console.error('Ошибка:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
      })
      if (response.ok) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    }
  }

  if (isLoading) {
    return <Box p={8}>Загрузка...</Box>
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        p={4}
        bg="gray.50"
        borderBottom="1px"
        borderColor="gray.200"
      >
        <Box mr={4}>{userEmail}</Box>
        <Button colorScheme="red" variant="outline" size="sm" onClick={handleLogout}>
          Выйти
        </Button>
      </Box>
      <Box p={8}>
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Суммаризатор</Tab>
            {isManager && <Tab>Отправка приглашений</Tab>}
          </TabList>

          <TabPanels>
            <SummarizerTab />
            {isManager && <InvitationsTab />}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}
