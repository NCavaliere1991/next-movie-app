import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { supabase } from '../utils/supabaseClient'

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()
  const onSubmit = async (data) => {
    const { user, session, error } = await supabase.auth.signUp(
      { email: data.email, password: data.password },
      {
        redirectTo: `${window.location.origin}/landing`
      }
    )
  }

  return (
    <div className="bg-main-blue h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-4 md:w-1/4 rounded-md"
      >
        <p className="text-right">
          Already have an account?{' '}
          <Link href="/sign-in" passHref>
            <a className="underline">Log in</a>
          </Link>
        </p>
        <div className="flex flex-col justify-center mt-5">
          <p className="text-3xl text-center">Register for an account</p>
          <label className="w-full mt-3">
            Email:
            <input
              className="w-full border border-black rounded-sm pl-2"
              {...register('email')}
            />
          </label>
          <label className="w-full mt-2">
            Password:
            <input
              type="password"
              className="w-full border border-black rounded-sm pl-2"
              {...register('password')}
            />
          </label>
          <button className="px-4 py-2 border rounded-md bg-black text-white w-1/3 mx-auto mt-5">
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}
