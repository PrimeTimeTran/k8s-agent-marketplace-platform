import { Sequelize } from 'sequelize'

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://user:password@localhost:5432/platform_db'

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
})

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
