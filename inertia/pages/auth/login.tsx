import { Head, useForm } from '@inertiajs/react'
import { Button, Input } from '~/components/ui'
import { withAuthLayout } from '~/layouts/auth'

function Login() {
  const { data, setData, post, processing, errors } = useForm({
    congNumber: '',
    password: '',
  })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    post('/login')
  }

  return (
    <>
      <Head title="Login" />
      <div className="flex min-h-full flex-col justify-center px-4 py-12 sm:mx-auto sm:w-full sm:max-w-lg sm:px-6">
        <img
          className="mx-auto h-24 w-auto rounded-xl"
          src="/territory-maps-icon.jpg"
          alt="Territory Maps Icon"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        <div className="mt-8 rounded-lg bg-white p-4 shadow-md sm:p-6">
          <form onSubmit={submit} className="space-y-4 sm:space-y-6" noValidate>
            <Input
              label="Congregation Number"
              name="congNumber"
              value={data.congNumber}
              onChange={(e) => setData('congNumber', e.target.value)}
              autoComplete="username"
              error={errors.congNumber}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              autoComplete="current-password"
              error={errors.password}
            />

            <Button type="submit" fullWidth loading={processing}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

Login.layout = withAuthLayout
export default Login
