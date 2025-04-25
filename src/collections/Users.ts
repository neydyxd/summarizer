import type { CollectionConfig } from 'payload'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {},
  access: {
    admin: ({ req: { user } }) => {
      return Boolean(user?.isAdmin)
    },
  },
  fields: [
    {
      name: 'isAdmin',
      type: 'checkbox',
    },
    {
      name: 'isManager',
      type: 'checkbox',
    },
  ],
  endpoints: [
    {
      path: '/add-first-user',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }

        // Проверяем, есть ли уже пользователи в системе
        const existingUsers = await req.payload.find({
          collection: 'users',
          limit: 1,
        })

        if (existingUsers.docs.length > 0) {
          return Response.json(
            { message: 'Пользователи уже существуют в системе' },
            { status: 400 },
          )
        }

        const data = await req.json()

        // Создаем первого пользователя с правами администратора
        const newUser = await req.payload.create({
          collection: 'users',
          data: {
            email: data.email,
            password: data.password,
            isAdmin: true,
            isManager: true,
          },
        })

        return Response.json({
          message: 'Первый пользователь успешно создан',
          user: newUser,
        })
      },
    },
    {
      path: '/forgot-password',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }
        const data = await req.json()
        const user = await req.payload.find({
          collection: 'users',
          where: {
            email: {
              equals: data.email,
            },
          },
        })

        if (!user.docs.length) {
          return Response.json({ message: 'Пользователь не найден' }, { status: 404 })
        }

        const API_URL =
          process.env.NODE_ENV === 'production' ? process.env.URL_PROD : process.env.URL_DEV

        const token = crypto.randomBytes(20).toString('hex')
        const resetLink = `${API_URL}/reset-password?token=${token}`
        const expirationDate = new Date(Date.now() + 3600000) // 1 час
        const datePart = expirationDate.toLocaleDateString('ru-RU', {
          // или 'en-US', в зависимости от желаемого формата даты
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        const timePart = expirationDate.toLocaleTimeString('ru-RU', {
          // или 'en-US', в зависимости от желаемого формата времени
          hour12: false, // Использовать 24-часовой формат
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        const formattedDate = `${datePart.split('.').reverse().join('-')} ${timePart}`

        await req.payload.update({
          collection: 'users',
          id: user.docs[0].id,
          data: {
            resetPasswordToken: token,
            resetPasswordExpiration: formattedDate,
          },
        })

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        const mailOptions = {
          to: data.email,
          from: `"Globus" <resume@team.globus-ltd.com>`,
          subject: 'Сброс пароля',
          text: `Вы получили это письмо, потому что вы (или кто-то другой) запросили сброс пароля для вашей учетной записи.\n\n
                 Пожалуйста, перейдите по следующей ссылке или вставьте ее в ваш браузер для завершения процесса:\n\n
                 ${resetLink}\n\n
                 Если вы не запрашивали это, пожалуйста, проигнорируйте это письмо, и ваш пароль останется неизменным.\n`,
        }

        await transporter.sendMail(mailOptions)

        return Response.json({ message: 'Письмо для сброса пароля отправлено' })
      },
    },
    {
      path: '/invite',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ message: 'Неверный формат запроса' }, { status: 400 })
        }

        const { user } = await req.payload.auth({ headers: req.headers })

        if (!user?.isManager) {
          return Response.json({ message: 'У вас нет доступа' }, { status: 403 })
        }

        const data = await req.json()

        // Проверяем, существует ли уже пользователь с таким email
        const existingUser = await req.payload.find({
          collection: 'users',
          where: {
            email: {
              equals: data.email,
            },
          },
        })

        if (existingUser.docs.length > 0) {
          return Response.json(
            { message: 'Пользователь с таким email уже существует' },
            { status: 400 },
          )
        }

        // Создаем временный пароль
        const tempPassword = Math.random().toString(36).slice(-8)

        // Создаем нового пользователя
        await req.payload.create({
          collection: 'users',
          data: {
            email: data.email,
            password: tempPassword,
            isManager: false,
            isAdmin: false,
          },
        })

        const API_URL =
          process.env.NODE_ENV === 'production' ? process.env.URL_PROD : process.env.URL_DEV

        const loginLink = `${API_URL}/login`

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        const mailOptions = {
          to: data.email,
          from: `"Globus" <resume@team.globus-ltd.com>`,
          subject: 'Приглашение в систему',
          text: `Вы получили это письмо, потому что вас пригласили присоединиться к нашей системе.\n\n
                 Для входа в систему используйте следующие данные:\n\n
                 Email: ${data.email}\n
                 Пароль: ${tempPassword}\n\n
                 Пожалуйста, перейдите по следующей ссылке для входа в систему:\n\n
                 ${loginLink}\n\n`,
        }

        await transporter.sendMail(mailOptions)

        return Response.json({ message: 'Приглашение отправлено' })
      },
    },
  ],
}
