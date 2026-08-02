import { motion, useReducedMotion, type Variants } from 'motion/react'
import { useNavigate } from 'react-router'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Wordmark } from '../../components/Wordmark'
import { signIn } from '../../lib/session'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
}

// Мок-авторизация: любые креды пускают в dashboard (этап 4)
export function LoginPage() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()

  // Форма компактная — смещение меньше, чем в hero (28), иначе стаггер читается
  // как «сборка» интерфейса, а не как проявление уже готового блока
  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        className="fixed inset-x-0 top-0"
        initial={{ opacity: 0, y: reduced ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-17 max-w-7xl items-center px-6">
          <Wordmark />
        </div>
      </motion.div>

      <motion.form
        className="flex w-full max-w-sm flex-col gap-4"
        variants={container}
        initial="hidden"
        animate="show"
        onSubmit={(e) => {
          e.preventDefault()
          signIn()
          navigate('/dashboard')
        }}
      >
        <motion.h1 variants={item} className="text-2xl font-semibold tracking-tight">
          Sign in
        </motion.h1>
        <motion.div variants={item}>
          <Input label="Email" type="email" autoComplete="email" />
        </motion.div>
        <motion.div variants={item}>
          <Input label="Password" type="password" autoComplete="current-password" />
        </motion.div>
        <motion.div variants={item} className="mt-2">
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </motion.div>
      </motion.form>
    </main>
  )
}
